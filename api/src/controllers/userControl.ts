
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../models/users";
import bcrypt from 'bcrypt';
import { registerUserSchema, loginUserSchema, updateUserRoleSchema } from "../schema/validator";

// Helper function for sending responses
const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  res.status(status).json({ success, message, ...(data && { data }) });
};

// Generate JWT token (expires in 2 hours)
const generateToken = (userId: string, email: string, verified: boolean,role:UserRole) => {
  return jwt.sign({ userId, email, verified, role }, process.env.TOKEN_SECRET as string, {
    expiresIn: "2h",
  });
};

// Register User (no authentication required)
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    // Validate request body
    const { error } = registerUserSchema.validate({ name, email, password });
    if (error) return sendResponse(res, 400, false, error.details[0].message);

    // Check for duplicate user
    if (await User.findOne({ email })) {
      return sendResponse(res, 400, false, "User already exists!");
    }

    // Save new user (the pre-save hook in the model will hash the password)
    const newUser = await new User({ name, email, password }).save();

    // Return user details (without password)
    const user = await User.findById(newUser._id).select("name email role verified createdAt updatedAt");
    
    sendResponse(res, 201, true, "User registered successfully.", { user });
  } catch (error) {
    sendResponse(res, 500, false, "An error occurred while processing your request.");
  }
};

// Login User (no authentication required)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    // Validate request body
    const { error } = loginUserSchema.validate({ email, password });
    if (error) return sendResponse(res, 400, false, error.details[0].message);

    // Find user (include password for comparison)
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) return sendResponse(res, 401, false, "User doesn't exist!");

    // Compare passwords
    const isValid = await bcrypt.compare(password, existingUser.password);
    if (!isValid) return sendResponse(res, 401, false, "Invalid credentials.");

    //User logged in/ verified
    existingUser.isLoggedIn = true;

if (!existingUser.verified) {
  existingUser.verified = true;
  await existingUser.save();
}

    // Generate token and set it as an HTTP-only cookie
    const token = generateToken(existingUser.id, existingUser.email, existingUser.verified ?? false, existingUser.role);
    res.cookie("Authorization", `Bearer ${token}`, {
      expires: new Date(Date.now() + 2 * 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",

    });

    // Return user data with successful login response
    sendResponse(res, 200, true, "Login successful!", { user: existingUser });
  } catch (error) {
    sendResponse(res, 500, false, "An error occurred while processing your request.");
  }
};

// Update User Role (Admin-only; protected route)
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  const { userId, role } = req.body;

  try {
    // Validate input
    const { error } = updateUserRoleSchema.validate({ userId, role });
    if (error) return sendResponse(res, 400, false, error.details[0].message);

    // Update user's role and exclude password from the response
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true } // Return the updated user
    ).select("-password"); // Exclude the password field

    if (!user) return sendResponse(res, 404, false, "User not found!");

    sendResponse(res, 200, true, "User role updated successfully.", { user });
  } catch (error) {
    sendResponse(res, 500, false, "An error occurred while processing your request.");
  }
};

// Get User by ID (Authenticated route)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id).select("-password"); // Exclude password from the response

    if (!user) return sendResponse(res, 404, false, "User not found!");

    sendResponse(res, 200, true, "User found.", { user });
  } catch (error) {
    sendResponse(res, 500, false, "An error occurred while processing your request.");
  }
};

// Get All Users (Admin-only route)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all users excluding password field
    const users = await User.find().select("-password");

    if (!users.length) return sendResponse(res, 404, false, "No users found.");

    sendResponse(res, 200, true, "Users found.", { users });
  } catch (error) {
    sendResponse(res, 500, false, "An error occurred while processing your request.");
  }
};

// Modify User (Authenticated route)
export const modifyUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  try {
    // Prepare updated user data
    const updatedData: any = { name, email, role };

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    // Update the user
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true }).select("-password");

    if (!user) return sendResponse(res, 404, false, "User not found!");

    sendResponse(res, 200, true, "User updated successfully.", { user });
  } catch (error) {
    sendResponse(res, 500, false, "An error occurred while processing your request.");
  }
};

// Delete User (Admin-only route)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Delete user by ID
    const user = await User.findByIdAndDelete(id);

    if (!user) return sendResponse(res, 404, false, "User not found!");

    sendResponse(res, 200, true, "User deleted successfully.");
  } catch (error) {
    sendResponse(res, 500, false, "An error occurred while processing your request.");
  }
};

// **Logout User (Newly Added)**
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return sendResponse(res, 401, false, "User not authenticated.");

    // Set isLoggedIn to false in the database
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    res.clearCookie("Authorization", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    sendResponse(res, 200, true, "Logout successful.");
  } catch (error) {
    sendResponse(res, 500, false, "An error occurred while logging out.");
  }
};


