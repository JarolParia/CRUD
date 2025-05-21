const authController = require('../src/controllers/AuthController');
const authService = require('../src/services/authService');

// Mock the auth service module to isolate controller tests
jest.mock('../src/services/authService');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset request and response objects before each test
    req = {
      body: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(), // mock chaining with .status().json()
      json: jest.fn()
    };
    jest.clearAllMocks(); // Clear any previous mocks
  });

  describe('login', () => {
    test('should return 400 if email or password is missing', async () => {
      // Call login with empty body (no email or password)
      await authController.login(req, res);

      // Expect HTTP 400 Bad Request with proper error message
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email and password are required'
      });
    });

    test('should return 200 and token on successful login', async () => {
      // Setup request with valid email and password
      req.body = { email: 'test@example.com', password: '123456' };
      // Mock successful loginUser response with token and user data
      const mockUserWithToken = { token: 'fake-token', user: { id: 1 } };

      authService.loginUser.mockResolvedValue(mockUserWithToken);

      // Call login method
      await authController.login(req, res);

      // Expect HTTP 200 OK with success message and token data
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: mockUserWithToken
      });
    });

    test('should return 401 for invalid credentials', async () => {
      // Setup request with wrong email and password
      req.body = { email: 'wrong@example.com', password: 'wrong' };
      // Mock loginUser throwing error for invalid credentials
      authService.loginUser.mockRejectedValue(new Error('Invalid credentials'));

      await authController.login(req, res);

      // Expect HTTP 401 Unauthorized with relevant message
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password'
      });
    });

    test('should return 403 when position is inactive', async () => {
      // Setup request with valid credentials but inactive position
      req.body = { email: 'inactive@example.com', password: '123456' };
      // Mock loginUser throwing error for inactive position
      authService.loginUser.mockRejectedValue(new Error('Position is inactive'));

      await authController.login(req, res);

      // Expect HTTP 403 Forbidden with appropriate message
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Your position is currently inactive. Please contact administrator.'
      });
    });

    test('should return 500 for unexpected errors', async () => {
      // Setup request with valid credentials
      req.body = { email: 'test@example.com', password: '123456' };
      // Mock loginUser throwing generic error (e.g., database error)
      authService.loginUser.mockRejectedValue(new Error('Database error'));

      await authController.login(req, res);

      // Expect HTTP 500 Internal Server Error with generic error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json.mock.calls[0][0].success).toBe(false);
      expect(res.json.mock.calls[0][0].message).toBe('Internal server error during login');
    });
  });

  describe('validateToken', () => {
    test('should return 401 if no token provided', async () => {
      // No authorization header provided
      req.headers.authorization = '';

      await authController.validateToken(req, res);

      // Expect HTTP 401 Unauthorized with message about missing token
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided'
      });
    });

    test('should return 200 and decoded data for valid token', async () => {
      // Authorization header with valid Bearer token
      req.headers.authorization = 'Bearer valid-token';
      // Mock decoded token data returned by authService
      const mockDecodedData = { id: 1, email: 'test@example.com' };
      
      authService.validateToken.mockResolvedValue(mockDecodedData);

      await authController.validateToken(req, res);

      // Expect HTTP 200 OK with success message and decoded token data
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Token is valid',
        data: mockDecodedData
      });
    });

    test('should return 401 for invalid token', async () => {
      // Authorization header with invalid token
      req.headers.authorization = 'Bearer invalid-token';
      // Mock validateToken throwing an error on invalid token
      authService.validateToken.mockRejectedValue(new Error('Token validation failed'));

      await authController.validateToken(req, res);

      // Expect HTTP 401 Unauthorized with error message and details
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token',
        error: 'Token validation failed'
      });
    });
  });

  describe('logout', () => {
    test('should return 200 with success message', () => {
      // Call logout (usually a simple response without async work)
      authController.logout(req, res);

      // Expect HTTP 200 OK with logout success message
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful'
      });
    });
  });
});
