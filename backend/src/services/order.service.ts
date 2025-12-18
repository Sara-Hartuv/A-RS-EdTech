import { IOrder, IOrderItem } from '../models/order.model';
import mongoose from 'mongoose';
import * as orderRepository from '../repositories/order.repository';
import * as productRepository from '../repositories/product.repository';

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

// POST - create new order
export const createOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  // Validate required fields
  if (!orderData.student) {
    throw new Error('Student is required');
  }

  if (!orderData.items || orderData.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  if (!mongoose.Types.ObjectId.isValid(orderData.student.toString())) {
    throw new Error('Invalid student ID');
  }

  // Validate each item and calculate total cost
  let totalCost = 0;
  const validatedItems: IOrderItem[] = [];

  for (const item of orderData.items) {
    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(item.product.toString())) {
      throw new Error('Invalid product ID in order items');
    }

    // Validate quantity
    if (!item.quantity || item.quantity < 1) {
      throw new Error('Each item must have a quantity of at least 1');
    }

    // Get product to validate existence and get price
    const product = await productRepository.findProductById(item.product.toString());
    
    if (!product) {
      throw new Error(`Product with ID ${item.product} not found`);
    }

    if (!product.status) {
      throw new Error(`Product ${product.name} is not available`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
    }

    // Add validated item with price at order time
    validatedItems.push({
      product: item.product,
      quantity: item.quantity,
      priceAtOrder: product.costInVouchers
    });

    // Calculate total cost
    totalCost += product.costInVouchers * item.quantity;
  }

  // Create order with validated data
  const newOrderData: Partial<IOrder> = {
    student: orderData.student,
    items: validatedItems,
    totalCost: totalCost,
    status: orderData.status || 'draft'
  };

  const newOrder = await orderRepository.createNewOrder(newOrderData);
  return newOrder;
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
  status: 'draft' | 'pendingApproval' | 'approved' | 'delivered'
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


