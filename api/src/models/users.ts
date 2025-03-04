
import mongoose, { Schema, Document, SchemaOptions } from 'mongoose';
import bcrypt from 'bcrypt';

// Enum for User Roles
export enum UserRole {
  ADMIN = 'Administrator',
  EMPLOYEE = 'Employee',
}

// Interface for User Document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole; // This should be typed as UserRole, not just string
  verified?: boolean;
  isLoggedIn?: boolean;
}

const schemaOptions: SchemaOptions = { timestamps: true };

// User schema definition
const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Exclude password from all queries
    role: {
      type: String,
      enum: Object.values(UserRole), // Use Object.values(UserRole) to reference the enum values
      default: UserRole.EMPLOYEE, // Default value from the enum
    },
    verified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
  },
  schemaOptions
);

// Pre-save hook for password hashing
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Add a `transform` function to automatically remove the password field when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;  // Remove the password field
    return ret;
  }
});

// Optionally, also apply for `.toObject()` if needed elsewhere
userSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;  // Remove the password field
    return ret;
  }
});

export default mongoose.model<IUser>('User', userSchema);
