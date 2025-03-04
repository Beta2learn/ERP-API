
import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  address: string;
  email: string;
  phone: string;
  purchaseHistory: mongoose.Types.ObjectId[]; // Array of order IDs
  active: boolean;
}

const clientSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  active: { type: Boolean, default: true },
});

const Client = mongoose.model<IClient>('Client', clientSchema);

export default Client;












