import { Request, Response } from 'express';
import Product from '../models/product';
import Order from '../models/order';

export const getStockReport = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Use lean() to return plain JSON objects instead of full Mongoose documents
    const products = await Product.find({}, 'name stock').lean();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching stock report:', error);
    res.status(500).json({ success: false, message: 'Error fetching stock report' });
  }
};

export const getMonthlyRevenue = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Define the start of the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // Aggregate orders that are not canceled and that were created from the start of the month onward
    const revenueResult = await Order.aggregate([
      { 
        $match: { 
          status: { $ne: 'Canceled' }, 
          creationDate: { $gte: startOfMonth } 
        } 
      },
      { 
        $group: { _id: null, total: { $sum: '$totalAmount' } } 
      }
    ]);

    const monthlyRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    res.status(200).json({ success: true, monthlyRevenue });
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({ success: false, message: 'Error fetching monthly revenue' });
  }
};
