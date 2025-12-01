import Order, { IOrder } from '../models/order.model';

export const findOrderById = async (orderId: string): Promise<IOrder | null> => {
  return await Order.findById(orderId).populate('student').populate('product');
};

export const findAllOrders = async (): Promise<IOrder[]> => {
  return await Order.find().populate('student').populate('product');
};

export const findOrdersByQuery = async (query: any): Promise<IOrder[]> => {
  return await Order.find(query).populate('student').populate('product');
};

export const findOrdersByStudent = async (studentId: string): Promise<IOrder[]> => {
  return await Order.find({ student: studentId }).populate('student').populate('product');
};

export const createNewOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  const newOrder = new Order(orderData);
  return await newOrder.save();
};

export const updateOrderById = async (
  orderId: string,
  updateData: Partial<IOrder>
): Promise<IOrder | null> => {
  return await Order.findByIdAndUpdate(
    orderId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('student').populate('product');
};


