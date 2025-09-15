import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Order from '../models/Order';
import { Server } from 'socket.io';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const orderData = {
      ...req.body,
      productImage: req.file ? `/uploads/${req.file.filename}` : null
    };

    const order = new Order(orderData);
    await order.save();

    // Emit real-time notification to admin
    const io: Server = req.app.get('io');
    io.to('admin-room').emit('new-order', {
      message: 'New order received',
      order: order
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
    
    let filter: any = {};
    
    if (search) {
      filter.productName = { $regex: search, $options: 'i' };
    }
    
    if (dateFrom && dateTo) {
      filter.createdAt = {
        $gte: new Date(dateFrom as string),
        $lte: new Date(dateTo as string)
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1 || quantity > 100) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be between 1 and 100'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order quantity updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};