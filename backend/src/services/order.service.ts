import { IOrder, IOrderItem } from '../models/order.model';
import mongoose, { ClientSession } from 'mongoose';
import * as orderRepository from '../repositories/order.repository';
import * as productRepository from '../repositories/product.repository';
import * as studentRepository from '../repositories/student.repository';
import Student from '../models/student.model';
import Product from '../models/product.model';

// =============================================================================
// SESSION-AWARE REPOSITORY WRAPPERS
// =============================================================================
// These wrappers extend repository functions to support MongoDB sessions
// for transactional operations, while keeping business logic in the service layer.

const findStudentByIdWithSession = async (
  studentId: string,
  session?: ClientSession
): Promise<any | null> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) return null;
  return await Student.findById(studentId).session(session || null).exec();
};

const findProductByIdWithSession = async (
  productId: string,
  session?: ClientSession
): Promise<any | null> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) return null;
  return await Product.findById(productId).session(session || null).exec();
};

const createOrderWithSession = async (
  orderData: Partial<IOrder>,
  session?: ClientSession
): Promise<IOrder> => {
  const newOrder = new (await import('../models/order.model')).default(orderData);
  return await newOrder.save({ session });
};

const decreaseStudentVouchers = async (
  studentId: string,
  amount: number,
  session?: ClientSession
): Promise<void> => {
  await Student.findByIdAndUpdate(
    studentId,
    { $inc: { currentVouchersCount: -amount } },
    { new: true, session }
  ).exec();
};

const decreaseProductStock = async (
  productId: string,
  quantity: number,
  session?: ClientSession
): Promise<void> => {
  await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: -quantity, purchasesCount: quantity } },
    { new: true, session }
  ).exec();
};

// =============================================================================
// HELPER FUNCTIONS FOR ORDER CREATION
// =============================================================================

/**
 * Validates order items and builds validated items with priceAtOrder.
 * 
 * Business Rules:
 * - Product must exist and be active
 * - Product must have sufficient stock
 * - Quantity must be at least 1
 * - priceAtOrder is locked to current product price
 */
interface ValidatedOrderItem extends IOrderItem {
  productName: string;
}

const validateAndBuildOrderItems = async (
  items: Partial<IOrderItem>[],
  session?: ClientSession
): Promise<ValidatedOrderItem[]> => {
  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  const validatedItems: ValidatedOrderItem[] = [];

  for (const item of items) {
    // Validate product ID
    if (!item.product || !mongoose.Types.ObjectId.isValid(item.product.toString())) {
      throw new Error('Invalid product ID in order items');
    }

    // Validate quantity
    if (!item.quantity || item.quantity < 1) {
      throw new Error('Each item must have a quantity of at least 1');
    }

    // Fetch product with session
    const product = await findProductByIdWithSession(item.product.toString(), session);

    if (!product) {
      throw new Error(`Product with ID ${item.product} not found`);
    }

    if (!product.status) {
      throw new Error(`Product "${product.name}" is not available`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
      );
    }

    // Build validated item with locked price
    validatedItems.push({
      product: item.product,
      quantity: item.quantity,
      priceAtOrder: product.costInVouchers,
      productName: product.name
    });
  }

  return validatedItems;
};

/**
 * Calculates total order cost from validated items.
 */
const calculateTotalCost = (validatedItems: ValidatedOrderItem[]): number => {
  return validatedItems.reduce((total, item) => {
    return total + item.priceAtOrder * item.quantity;
  }, 0);
};

/**
 * Verifies student exists and has enough vouchers for the order.
 * Throws error if student not found or insufficient vouchers.
 */
const assertStudentHasEnoughVouchers = async (
  studentId: string,
  totalCost: number,
  session?: ClientSession
): Promise<void> => {
  const student = await findStudentByIdWithSession(studentId, session);

  if (!student) {
    throw new Error('Student not found');
  }

  const currentVouchers = student.currentVouchersCount || 0;

  if (currentVouchers < totalCost) {
    throw new Error(
      `Insufficient vouchers. Required: ${totalCost}, Available: ${currentVouchers}`
    );
  }
};

/**
 * Applies order side effects: decreases student vouchers and product stock.
 * This function modifies the database and must run within a transaction.
 */
const applyOrderSideEffects = async (
  studentId: string,
  items: ValidatedOrderItem[],
  totalCost: number,
  session?: ClientSession
): Promise<void> => {
  // Decrease student vouchers
  await decreaseStudentVouchers(studentId, totalCost, session);

  // Decrease stock for each product
  for (const item of items) {
    await decreaseProductStock(item.product.toString(), item.quantity, session);
  }
};

// GET - get order by ID
export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }
  
  const order = await orderRepository.findOrderById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  return order;
};

// GET - get all orders
export const getAllOrders = async (): Promise<IOrder[]> => {
  const orders = await orderRepository.findAllOrders();
  return orders;
};

// GET - get orders by status
export const getOrdersByStatus = async (status: string): Promise<IOrder[]> => {
  const orders = await orderRepository.findOrdersByQuery({ status });
  return orders;
};

// GET - get orders by student
export const getOrdersByStudent = async (studentId: string): Promise<IOrder[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }
  
  const orders = await orderRepository.findOrdersByStudent(studentId);
  return orders;
};

// GET - get pending orders
export const getPendingOrders = async (): Promise<IOrder[]> => {
  const orders = await orderRepository.findOrdersByQuery({ status: 'pending' });
  return orders;
};

// =============================================================================
// POST - CREATE NEW ORDER (TRANSACTIONAL)
// =============================================================================
/**
 * Creates a new order with full transactional integrity.
 * 
 * Business Flow (ATOMIC - ALL OR NOTHING):
 * 1. Validate order input
 * 2. Validate and build order items with locked prices
 * 3. Calculate total order cost
 * 4. Verify student has enough vouchers
 * 5. Create order document
 * 6. Decrease student vouchers
 * 7. Decrease product stock
 * 8. Commit transaction
 * 
 * On any error: entire transaction is rolled back.
 */
export const createOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  // Start MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Validate required fields
    if (!orderData.student) {
      throw new Error('Student is required');
    }

    if (!mongoose.Types.ObjectId.isValid(orderData.student.toString())) {
      throw new Error('Invalid student ID');
    }

    // Step 2: Validate and build order items with locked prices
    const validatedItems = await validateAndBuildOrderItems(orderData.items || [], session);

    // Step 3: Calculate total order cost
    const totalCost = calculateTotalCost(validatedItems);

    // Step 4: Verify student has enough vouchers BEFORE creating order
    await assertStudentHasEnoughVouchers(
      orderData.student.toString(),
      totalCost,
      session
    );

    // Step 5: Create order document
    const newOrderData: Partial<IOrder> = {
      student: orderData.student,
      items: validatedItems,
      totalCost: totalCost,
      status: orderData.status || 'newOrder'
    };

    const newOrder = await createOrderWithSession(newOrderData, session);

    // Step 6 & 7: Apply side effects (decrease vouchers and stock)
    await applyOrderSideEffects(
      orderData.student.toString(),
      validatedItems,
      totalCost,
      session
    );

    // Step 8: Commit transaction - all changes are applied atomically
    await session.commitTransaction();
    session.endSession();

    // Return created order with populated fields
    const populatedOrder = await orderRepository.findOrderById((newOrder as any)._id.toString());
    return populatedOrder!;

  } catch (error) {
    // Rollback transaction on any error
    await session.abortTransaction();
    session.endSession();
    
    // Re-throw the error to be handled by controller
    throw error;
  }
};

// PUT - update order by ID
export const updateOrder = async (
  orderId: string,
  updateData: Partial<IOrder>
): Promise<IOrder | null> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  // If updating items, validate and recalculate total cost
  if (updateData.items) {
    if (updateData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    let totalCost = 0;
    const validatedItems: IOrderItem[] = [];

    for (const item of updateData.items) {
      if (!mongoose.Types.ObjectId.isValid(item.product.toString())) {
        throw new Error('Invalid product ID in order items');
      }

      if (!item.quantity || item.quantity < 1) {
        throw new Error('Each item must have a quantity of at least 1');
      }

      const product = await productRepository.findProductById(item.product.toString());
      
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      if (!product.status) {
        throw new Error(`Product ${product.name} is not available`);
      }

      validatedItems.push({
        product: item.product,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder || product.costInVouchers
      });

      totalCost += (item.priceAtOrder || product.costInVouchers) * item.quantity;
    }

    updateData.items = validatedItems;
    updateData.totalCost = totalCost;
  }

  const updatedOrder = await orderRepository.updateOrderById(orderId, updateData);
  
  if (!updatedOrder) {
    throw new Error('Order not found');
  }

  return updatedOrder;
};

// PUT - change order status
export const updateOrderStatus = async (
  orderId: string,
  status: 'newOrder' | 'preparing' | 'delivered'
): Promise<IOrder | null> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  const updatedOrder = await orderRepository.updateOrderById(orderId, { status });
  
  if (!updatedOrder) {
    throw new Error('Order not found');
  }

  return updatedOrder;
};

// PUT - mark order as delivered
export const markOrderAsDelivered = async (orderId: string): Promise<IOrder | null> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  const updatedOrder = await orderRepository.updateOrderById(orderId, { 
    status: 'delivered'
  });
  
  if (!updatedOrder) {
    throw new Error('Order not found');
  }

  return updatedOrder;
};


