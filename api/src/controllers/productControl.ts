import { Request, Response } from 'express';
import Product from '../models/product';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatProduct } from '../utils/productFormatter';



// Create a Product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, category } = req.body;
    const newProduct = new Product({ name, description, price, stock, category });
    await newProduct.save();

    // Convert Mongoose document to a plain object for modification
    const product = newProduct.toObject() as Record<string, any>;
    product.unitPrice = formatCurrency(product.price, 'EUR'); // Convert price to unitPrice
    delete product.price; // Remv  original `price` field
    delete product._id; // Remv `_id` from response

    //refactor properties as desired
    const formattedProducts = {
      name: product.name,
      description: product.description,
      unitPrice: product.unitPrice,
      stock: product.stock,
      category: product.category,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      _v: product._v,
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: formattedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating product', error });
  }
};


export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).lean(); // Use .lean() to get a plain object

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Format the product to match the expected response
    const formattedProduct = formatProduct(product, 'EUR');

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      product: formattedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product', error });
  }
};


// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().lean();  // Add .lean() here to remove Mongoose metadata

    // Get the total number of products
    const totalProducts = await Product.countDocuments();

    // Format each product
    const formattedProducts = products.map((product) => formatProduct(product, 'EUR'));

    res.status(200).json({
      success: true,
      totalProducts, // Add total number of prodts to response
      products: formattedProducts, // Retrn formatted products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error });
  }
};

// Update a Product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, category } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, category },
      { new: true }
    );
    if (!updatedProduct) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Format the updated product
    const formattedProduct = formatProduct(updatedProduct.toObject(), 'EUR');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: formattedProduct, // Use  formatted prodt in the response
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error });
  }
};

// Delete a Product
export const deleteProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body; // single ID or an array of IDs

    if (!ids || (Array.isArray(ids) && ids.length === 0)) {
      res.status(400).json({ success: false, message: 'Please provide a valid product ID or an array of product IDs to delete' });
      return;
    }

    let deletedCount = 0;

    if (Array.isArray(ids)) {
      const result = await Product.deleteMany({ _id: { $in: ids } });
      deletedCount = result.deletedCount;
    } else {
      const result = await Product.findByIdAndDelete(ids);
      deletedCount = result ? 1 : 0;
    }

    if (deletedCount === 0) {
      res.status(404).json({ success: false, message: 'No products found to delete' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `${deletedCount} product(s) deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product(s)', error });
  }
};
