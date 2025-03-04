import express from "express";
import { registerUser, loginUser, updateUserRole, getUserById, getAllUsers, 
  modifyUser, deleteUser, logoutUser } from "../controllers/userControl";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/user/{id}/role:
 *   put:
 *     summary: Update user role
 *     description: Allows an admin to update a user's role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       403:
 *         description: Forbidden (Admin access required)
 *       404:
 *         description: User not found
 */
router.put("/user/:id/role", authMiddleware, adminMiddleware, updateUserRole);

/**
 * @swagger
 * /api/users/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user's details by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/user/:id", authMiddleware, getUserById);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users (Admin only).
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       403:
 *         description: Forbidden (Admin access required)
 */
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

/**
 * @swagger
 * /api/users/user/{id}:
 *   put:
 *     summary: Modify user details
 *     description: Allows an authenticated user to update their profile.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       403:
 *         description: Forbidden (Unauthorized action)
 *       404:
 *         description: User not found
 */
router.put("/user/:id", authMiddleware, modifyUser);

/**
 * @swagger
 * /api/users/user/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Allows an admin to delete a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden (Admin access required)
 *       404:
 *         description: User not found
 */
router.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);

/**
 * @swagger
 * /api/users/user/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized (user not logged in)
 */
router.post("/user/logout", logoutUser);

export default router;
