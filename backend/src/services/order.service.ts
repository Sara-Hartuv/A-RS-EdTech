import { IOrder } from '../models/order.model';
import mongoose from 'mongoose';
import * as orderRepository from '../repositories/order.repository';

// GET - קבלת הזמנה לפי ID
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

// GET - קבלת כל ההזמנות
export const getAllOrders = async (): Promise<IOrder[]> => {
  const orders = await orderRepository.findAllOrders();
  return orders;
};

// GET - קבלת הזמנות לפי סטטוס
export const getOrdersByStatus = async (status: string): Promise<IOrder[]> => {
  const orders = await orderRepository.findOrdersByQuery({ status });
  return orders;
};

// GET - קבלת הזמנות לפי סטודנט
export const getOrdersByStudent = async (studentId: string): Promise<IOrder[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }
  
  const orders = await orderRepository.findOrdersByStudent(studentId);
  return orders;
};

// GET - קבלת הזמנות ממתינות
export const getPendingOrders = async (): Promise<IOrder[]> => {
  const orders = await orderRepository.findOrdersByQuery({ status: 'pending' });
  return orders;
};

// POST - יצירת הזמנה חדשה
export const createOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  // וולידציה על השדות הנדרשים
  if (!orderData.student || !orderData.product) {
    throw new Error('Student and product are required');
  }

  if (!mongoose.Types.ObjectId.isValid(orderData.student.toString())) {
    throw new Error('Invalid student ID');
  }

  if (!mongoose.Types.ObjectId.isValid(orderData.product.toString())) {
    throw new Error('Invalid product ID');
  }

  if (orderData.quantity && orderData.quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  const newOrder = await orderRepository.createNewOrder(orderData);
  return newOrder;
};

// PUT - עדכון הזמנה לפי ID
export const updateOrder = async (
  orderId: string,
  updateData: Partial<IOrder>
): Promise<IOrder | null> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  const updatedOrder = await orderRepository.updateOrderById(orderId, updateData);
  
  if (!updatedOrder) {
    throw new Error('Order not found');
  }

  return updatedOrder;
};

// PUT - שינוי סטטוס הזמנה
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

// PUT - סימון הזמנה כנמסרה
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


