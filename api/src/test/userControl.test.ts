import { registerUser } from '../controllers/userControl'; // Adjust based on your actual file path
import { Request, Response } from 'express';
import users from '../models/users';

describe('registerUser function', () => {

  it('should register a new user successfully', async () => {
    // Mock request and response objects
    const req = {
      body: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Simulate DB to make sure the user doesn't exist
    jest.spyOn(users, 'findOne').mockResolvedValueOnce(null);

    // Call the registerUser function
    await registerUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'User registered successfully.',
      })
    );
  });

  it('should return an error if the user already exists', async () => {
    // Simulate existing user in DB
    const req = {
      body: {
        name: "jordan",
        email: "jordn@mail.com",
        password: "jordan333",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Simulate DB check for existing user
    jest.spyOn(users, 'findOne').mockResolvedValueOnce({ email: 'jordn@mail.com' });

    await registerUser(req, res);

    // Assertions for existing user scenario
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'User already exists!',
      })
    );
  });
});
