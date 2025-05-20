const { loginUser, validateToken } = require('../src/services/authService');
const { User, Position } = require('../src/models');
const { comparePassword } = require('../src/utils/bcryptHelper');
const { generateToken, verifyToken } = require('../src/utils/HelperJwt');

// Mocking models and utility functions
jest.mock('../src/models');
jest.mock('../src/utils/bcryptHelper');
jest.mock('../src/utils/HelperJwt');

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test to avoid interference
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should return user with token when credentials are valid', async () => {
      // Mock user data returned from the database
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed123',
        firstName: 'John',
        lastName: 'Doe',
        position: { positionId: 1, positionName: 'Admin', status: true }
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mock password comparison to succeed and token generation
      comparePassword.mockResolvedValue(true);
      generateToken.mockReturnValue('fake-token');

      // Call loginUser with valid credentials
      const result = await loginUser('test@example.com', '123456');

      // Verify that User.findOne was called with correct parameters
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: expect.anything(),
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      // Check that the returned result includes the token
      expect(result).toHaveProperty('token', 'fake-token');
    });

    it('should throw error when user does not exist', async () => {
      // Simulate user not found in database
      User.findOne.mockResolvedValue(null);

      // Expect loginUser to throw 'Invalid credentials' error
      await expect(loginUser('invalid@example.com', '123456'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw error when position is inactive', async () => {
      // Mock user with inactive position
      const mockUser = {
        id: 1,
        position: { status: false }
      };
      User.findOne.mockResolvedValue(mockUser);

      // Expect loginUser to throw 'Position is inactive' error
      await expect(loginUser('test@example.com', '123456'))
        .rejects.toThrow('Position is inactive');
    });
  });

  describe('validateToken', () => {
    it('should return decoded data when token is valid', async () => {
      // Mock decoded token payload
      const mockDecoded = { id: 1 };
      verifyToken.mockReturnValue(mockDecoded);
      // Mock user found in DB with active position
      User.findByPk.mockResolvedValue({ id: 1, position: { status: true } });

      // Call validateToken with valid token
      const result = await validateToken('valid-token');
      // Expect the decoded data to be returned
      expect(result).toEqual(mockDecoded);
    });

    it('should throw error when user does not exist', async () => {
      // Mock decoded token with non-existing user ID
      verifyToken.mockReturnValue({ id: 999 });
      // Simulate user not found in DB
      User.findByPk.mockResolvedValue(null);

      // Expect validateToken to throw an error about missing user or inactive position
      await expect(validateToken('invalid-token'))
        .rejects.toThrow('User not found or position inactive');
    });
  });
});
