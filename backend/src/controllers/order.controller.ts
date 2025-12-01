import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

// GET - קבלת הזמנה לפי ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET - קבלת כל ההזמנות
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET - קבלת הזמנות לפי סטטוס
export const getOrdersByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;
    const orders = await orderService.getOrdersByStatus(status);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET - קבלת הזמנות לפי סטודנט
export const getOrdersByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const orders = await orderService.getOrdersByStudent(studentId);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET - קבלת הזמנות ממתינות
export const getPendingOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderService.getPendingOrders();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST - יצירת הזמנה חדשה
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderData = req.body;
    const newOrder = await orderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - עדכון הזמנה
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedOrder = await orderService.updateOrder(id, updateData);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - שינוי סטטוס הזמנה
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(id, status);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - סימון הזמנה כנמסרה
export const markOrderAsDelivered = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedOrder = await orderService.markOrderAsDelivered(id);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


