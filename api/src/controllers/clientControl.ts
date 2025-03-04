import { Request, Response } from 'express';
import Client from '../models/client';

// Create a new client
export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, address, email, phone } = req.body;
    const newClient = new Client({ name, address, email, phone });

    await newClient.save();
    res.status(201).json({ message: 'Client created successfully', client: newClient });
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error });
  }
};

// Get all active clients
export const getActiveClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find({ active: true });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error });
  }
};

// Get a specific client
export const getClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
    res.status(404).json({ message: 'Client not found' });
    return;
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client', error });
  }
};

// Update client details (excluding active status)
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { name, address, email, phone } = req.body;
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { name, address, email, phone },
      { new: true }
    );

    if (!updatedClient) {
    res.status(404).json({ message: 'Client not found' });
    return;
    }

    res.status(200).json({ message: 'Client updated successfully', client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error });
  }
};

// Set client as inactive or active (Admin only)
export const toggleClientStatus = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
    res.status(404).json({ message: 'Client not found' });
    return;
    }

    client.active = !client.active;
    await client.save();
    res.status(200).json({ message: `Client status updated to ${client.active ? 'active' : 'inactive'}`, client });
  } catch (error) {
    res.status(500).json({ message: 'Error updating client status', error });
  }
};

// Add an order to a client's purchase history
export const addOrderToHistory = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
    res.status(404).json({ message: 'Client not found' });
    return;
    }

    client.purchaseHistory.push(req.body.orderId);
    await client.save();
    res.status(200).json({ message: 'Order added to purchase history', client });
  } catch (error) {
    res.status(500).json({ message: 'Error adding order to history', error });
  }
};

// Remove an order from the purchase history
export const removeOrderFromHistory = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
    res.status(404).json({ message: 'Client not found' });
    return;
    }

    client.purchaseHistory = client.purchaseHistory.filter(orderId => orderId.toString() !== req.body.orderId);
    await client.save();
    res.status(200).json({ message: 'Order removed from purchase history', client });
  } catch (error) {
    res.status(500).json({ message: 'Error removing order from history', error });
  }
};
