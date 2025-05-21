const {
  getallPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
} = require('../src/services/positionService');  // Import service functions to test

const { Position, User, sequelize } = require('../src/models');  // Import models and sequelize instance

jest.mock('../src/models');  // Mock the models to isolate tests from the actual database

describe('Position Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();  // Clear all mocks before each test to avoid interference

    // Mock sequelize.transaction method to simulate transaction behavior with commit and rollback
    sequelize.transaction = jest.fn(() => ({
      commit: jest.fn().mockResolvedValue(true),    // Mock commit resolves successfully
      rollback: jest.fn().mockResolvedValue(true)   // Mock rollback resolves successfully
    }));
  });

  // Test suite for the getallPositions service function
  describe('getallPositions', () => {
    it('should return paginated positions', async () => {
      // Mocked response simulating the count and list of positions returned by the database
      const mockPositions = { count: 2, rows: [{ id: 1 }, { id: 2 }] };
      Position.findAndCountAll.mockResolvedValue(mockPositions);  // Mock the Sequelize method

      // Call the service function with limit 10 and offset 0
      const result = await getallPositions(10, 0);

      // Expect the result to be equal to the mocked positions object
      expect(result).toEqual(mockPositions);
    });
  });

  // Test suite for the createPosition service function
  describe('createPosition', () => {
    it('should create a new position', async () => {
      // Mock data for a new position
      const mockData = { positionName: 'Developer', status: true };
      Position.create.mockResolvedValue(mockData);  // Mock the Sequelize create method

      // Call the createPosition service function with mock data
      const result = await createPosition(mockData);

      // Verify that Position.create was called with the correct data
      expect(Position.create).toHaveBeenCalledWith(mockData);
    });
  });

  // Test suite for the deletePosition service function
  describe('deletePosition', () => {
    it('should delete a position without associated users', async () => {
      // Mock position object with a destroy method (for deletion)
      const mockPosition = { id: 1, destroy: jest.fn() };
      Position.findByPk.mockResolvedValue(mockPosition);  // Mock finding position by primary key
      User.count.mockResolvedValue(0);  // Mock counting associated users returns zero

      // Call the deletePosition function for position with id 1
      await deletePosition(1);

      // Verify a transaction was started
      expect(sequelize.transaction).toHaveBeenCalled();

      // Verify that the position's destroy method was called (deleted)
      expect(mockPosition.destroy).toHaveBeenCalled();
    });

    it('should throw error if there are associated users', async () => {
      const mockPosition = { id: 1 };
      Position.findByPk.mockResolvedValue(mockPosition);  // Position exists
      User.count.mockResolvedValue(1);  // There is 1 associated user

      // Expect deletePosition to throw an error when trying to delete a position with associated users
      await expect(deletePosition(1))
        .rejects.toThrow('Cannot delete position with associated users');
    });

    it('should rollback if an error occurs', async () => {
      // Mock transaction with commit and rollback functions
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };
      sequelize.transaction.mockResolvedValue(mockTransaction);  // Mock transaction returned by sequelize

      Position.findByPk.mockRejectedValue(new Error('DB Error'));  // Simulate DB error on findByPk

      // Expect deletePosition to throw the DB error
      await expect(deletePosition(1)).rejects.toThrow('DB Error');

      // Verify that the transaction rollback was called due to the error
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
