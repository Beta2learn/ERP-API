import { Request, Response } from 'express';
import Order from '../models/order';
import { formatCurrency } from '../utils/currencyFormatter';
import { OrderStatus } from '../models/order';

// Create Order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId, products, currency = 'EUR', status = 'Pending' } = req.body;

    // Calculate totalAmount from products (quantity * unitPrice)
    const totalAmount = products.reduce((total: number, product: { quantity: number; unitPrice: number; }) => {
      return total + (product.quantity * product.unitPrice);
    }, 0);

    // Create new order
    const order = new Order({
      clientId,
      products,
      totalAmount,
      currency, 
      status,    
    });

    // Save order
    await order.save();

    // Format the totalAmount based on the currency and locale (optional)
    const formattedTotalAmount = formatCurrency(order.totalAmount, order.currency);

    res.status(201).json({ 
      success: true, 
      message: "Order created successfully", 
      order,
      formattedTotalAmount // Include the formatted value
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating order", error });
  }
};


// Update Order
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, products, currency } = req.body;

    // Calculate new totalAmount from products (quantity * unitPrice)
    const totalAmount = products.reduce((total: number, product: { quantity: number; unitPrice: number; }) => {
      return total + (product.quantity * product.unitPrice);
    }, 0);

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status, products, totalAmount, currency },
      { new: true }
    );

    // Handle null case for updatedOrder
    if (!updatedOrder) {
    res.status(404).json({ success: false, message: "Order not found" });
    return;
    }

    // Format the totalAmount based on the currency
    const formattedTotalAmount = formatCurrency(updatedOrder.totalAmount, updatedOrder.currency);

    res.status(200).json({ success: true, message: "Order updated successfully", updatedOrder, formattedTotalAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order", error });
  }
};

// Get Order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('clientId products');
    
    // Handle null case for order
    if (!order) {
    res.status(404).json({ success: false, message: "Order not found" });
    return;
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching order", error });
  }
};

export const getOrdersByClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ clientId: req.params.clientId }).populate('clientId products');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders for client", error });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate('clientId products'); // Include product details
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error });
  }
};

// Delete Order
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    
    // Handle null case for deletedOrder
    if (!deletedOrder) {
    res.status(404).json({ success: false, message: "Order not found" });
    return;
    }
    
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting order", error });
  }
};

// Handle Order Status Change
export const handleOrderStatusChange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;  // e.g., 'Pending', 'Shipped', 'Delivered', 'Canceled'
    const orderId = req.params.id;

    // Validate status
    if (!['Pending', 'Shipped', 'Delivered', 'Canceled'].includes(status)) {
    res.status(400).json({ success: false, message: "Invalid status" });
    return;
    }

    const order = await Order.findById(orderId);

    // Handle null case for order
    if (!order) {
    res.status(404).json({ success: false, message: "Order not found" });
    return;
    }

    // Update the order status
    order.status = status;

    // Save the updated order
    await order.save();

    res.status(200).json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order status", error });
  }
};
