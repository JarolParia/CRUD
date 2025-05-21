const request = require('supertest'); // Library to test HTTP requests to the Express app
const express = require('express');
const userController = require('../src/controllers/userController'); // User controller
const userService = require('../src/services/userService'); // User service

// Mock the userService to simulate its behavior in tests
jest.mock('../src/services/userService');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Define routes and link to userController methods
app.get('/users', userController.getAllUsers);
app.post('/users', userController.createUser);
app.get('/users/:id', userController.getUserById);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.userDelete);

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock calls and instances before each test
  });

  // Tests for GET /users endpoint
  describe('GET /users', () => {
    it('should return paginated users', async () => {
      // Mock data returned by userService.getallUsers
      const mockUsers = {
        count: 2,
        rows: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' }
        ]
      };
      userService.getallUsers.mockResolvedValue(mockUsers); // Simulate successful promise resolution

      // Perform GET request with pagination query parameters
      const response = await request(app)
        .get('/users?page=1&limit=10');
      
      // Expect HTTP status 200 (OK)
      expect(response.status).toBe(200);
      // Expect the response body to match this structure
      expect(response.body).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        users: mockUsers.rows
      });
    });

    it('should handle errors properly', async () => {
      // Simulate rejection (error) from userService.getallUsers
      userService.getallUsers.mockRejectedValue(new Error('Database error'));

      // Perform GET request without query parameters
      const response = await request(app)
        .get('/users');
      
      // Expect HTTP status 500 (Internal Server Error)
      expect(response.status).toBe(500);
    });
  });

  // Tests for POST /users endpoint
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const mockUser = { id: 1, name: 'New User' };
      userService.createUser.mockResolvedValue(mockUser); // Simulate successful creation

      // Perform POST request sending user data in body
      const response = await request(app)
        .post('/users')
        .send({ name: 'New User' });
      
      // Expect HTTP status 201 (Created)
      expect(response.status).toBe(201);
      // Expect response body to equal the created user
      expect(response.body).toEqual(mockUser);
    });

    it('should handle errors when creating user', async () => {
      // Simulate validation error from service
      userService.createUser.mockRejectedValue(new Error('Validation error'));

      // Perform POST request with invalid (empty) data
      const response = await request(app)
        .post('/users')
        .send({});
      
      // Expect HTTP status 500 (Internal Server Error)
      expect(response.status).toBe(500);
    });
  });

  // Tests for GET /users/:id endpoint
  describe('GET /users/:id', () => {
    it('should return an existing user', async () => {
      const mockUser = { id: 1, name: 'Existing User' };
      userService.getUserById.mockResolvedValue(mockUser); // Simulate found user

      const response = await request(app)
        .get('/users/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user does not exist', async () => {
      // Simulate "not found" error from service
      userService.getUserById.mockRejectedValue(new Error('User not found'));

      const response = await request(app)
        .get('/users/999');
      
      // Expect HTTP status 404 (Not Found)
      expect(response.status).toBe(404);
    });

    it('should handle other errors', async () => {
      // Simulate database connection error
      userService.getUserById.mockRejectedValue(new Error('DB connection error'));

      const response = await request(app)
        .get('/users/1');
      
      // Expect HTTP status 500 for other errors
      expect(response.status).toBe(500);
    });
  });

  // Tests for PUT /users/:id endpoint
  describe('PUT /users/:id', () => {
    it('should update an existing user', async () => {
      userService.updateUser.mockResolvedValue(true); // Simulate successful update

      const response = await request(app)
        .put('/users/1')
        .send({ name: 'Updated Name' });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated successfully');
    });

    it('should return 400 if ID is missing', async () => {
      // Trying to PUT without an ID in URL triggers 404 in Express by default
      const response = await request(app)
        .put('/users/')
        .send({ name: 'Updated Name' });
      
      expect(response.status).toBe(404);
    });

    it('should return 404 if user does not exist', async () => {
      userService.updateUser.mockRejectedValue(new Error('User not found')); // Simulate not found error

      const response = await request(app)
        .put('/users/999')
        .send({ name: 'Updated Name' });
      
      expect(response.status).toBe(404);
    });

    it('should handle other errors', async () => {
      userService.updateUser.mockRejectedValue(new Error('Validation error')); // Simulate other error

      const response = await request(app)
        .put('/users/1')
        .send({});
      
      expect(response.status).toBe(500);
    });
  });

  // Tests for DELETE /users/:id endpoint
  describe('DELETE /users/:id', () => {
    it('should delete an existing user', async () => {
      const mockUser = { id: 1, name: 'Deleted User' };
      userService.deleteUser.mockResolvedValue(mockUser); // Simulate successful deletion

      const response = await request(app)
        .delete('/users/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'User deleted successfully',
        data: mockUser
      });
    });

    it('should return 404 if user does not exist', async () => {
      userService.deleteUser.mockRejectedValue(new Error('User not found')); // Simulate not found error

      const response = await request(app)
        .delete('/users/999');
      
      expect(response.status).toBe(404);
    });

    it('should handle other errors', async () => {
      userService.deleteUser.mockRejectedValue(new Error('DB error')); // Simulate database error

      const response = await request(app)
        .delete('/users/1');
      
      expect(response.status).toBe(500);
    });
  });
});
