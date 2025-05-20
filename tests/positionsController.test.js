const {
  getallPositions,
  getallPositionsAll,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
} = require('../src/services/positionService');
const { Position, User, sequelize } = require('../src/models');

// Mock the models and sequelize
jest.mock('../src/models');

describe('Position Service', () => {
  // Reset mocks before each test case
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the sequelize.transaction method to return an object with commit and rollback mocks
    sequelize.transaction = jest.fn(() => ({
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true)
    }));
  });

  // Tests for getallPositions function
  describe('getallPositions', () => {
    it('should return paginated positions', async () => {
      // Mock the response from Position.findAndCountAll to simulate DB returning paginated results
      const mockData = {
        count: 2,
        rows: [
          { id: 1, positionName: 'Developer' },
          { id: 2, positionName: 'Manager' }
        ]
      };
      Position.findAndCountAll.mockResolvedValue(mockData);

      // Call the service function with limit and offset params
      const result = await getallPositions(10, 0);
      
      // Validate that the Sequelize model method was called correctly
      expect(Position.findAndCountAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0
      });
      // Validate that the result matches the mocked data
      expect(result).toEqual(mockData);
    });

    it('should throw error when query fails', async () => {
      // Simulate a database error
      Position.findAndCountAll.mockRejectedValue(new Error('DB error'));

      // Expect the service to throw a specific error message
      await expect(getallPositions(10, 0))
        .rejects.toThrow('Error fetching positions:DB error');
    });
  });

  // Tests for getallPositionsAll function
  describe('getallPositionsAll', () => {
    it('should return all active positions', async () => {
      // Mock the response to return active positions only
      const mockPositions = [
        { positionId: 1, positionName: 'Developer', status: true }
      ];
      Position.findAll.mockResolvedValue(mockPositions);

      // Call the service function
      const result = await getallPositionsAll();
      
      // Check if findAll was called with the correct "where" condition and attributes
      expect(Position.findAll).toHaveBeenCalledWith({
        where: { status: true },
        attributes: ['positionId', 'positionName', 'status']
      });
      // Validate the returned data
      expect(result).toEqual(mockPositions);
    });

    it('should throw error when query fails', async () => {
      Position.findAll.mockRejectedValue(new Error('DB error'));

      await expect(getallPositionsAll())
        .rejects.toThrow('Error fetching positions:DB error');
    });
  });

  // Tests for getPositionById function
  describe('getPositionById', () => {
    it('should return an existing position', async () => {
      // Mock finding a position by primary key
      const mockPosition = { id: 1, positionName: 'Developer' };
      Position.findByPk.mockResolvedValue(mockPosition);

      const result = await getPositionById(1);
      
      expect(Position.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPosition);
    });

    it('should throw error when position does not exist', async () => {
      // Simulate no position found
      Position.findByPk.mockResolvedValue(null);

      await expect(getPositionById(999))
        .rejects.toThrow('Position not found');
    });

    it('should throw error when query fails', async () => {
      Position.findByPk.mockRejectedValue(new Error('DB error'));

      await expect(getPositionById(1))
        .rejects.toThrow('Error fetching position: DB error');
    });
  });

  // Tests for createPosition function
  describe('createPosition', () => {
    it('should create a new position', async () => {
      // Mock data for creating a new position
      const mockData = { positionName: 'New Position', status: true };
      const mockPosition = { id: 1, ...mockData };
      Position.create.mockResolvedValue(mockPosition);

      const result = await createPosition(mockData);
      
      // Check that create was called with the correct data
      expect(Position.create).toHaveBeenCalledWith({
        positionName: 'New Position',
        status: true
      });
      expect(result).toEqual(mockPosition);
    });

    it('should use status true by default', async () => {
      // If status is not provided, it should default to true
      const mockPosition = { id: 1, positionName: 'New Position', status: true };
      Position.create.mockResolvedValue(mockPosition);

      const result = await createPosition({ positionName: 'New Position' });
      
      expect(Position.create).toHaveBeenCalledWith({
        positionName: 'New Position',
        status: true
      });
    });

    it('should throw error when creation fails', async () => {
      // Simulate validation error on create
      Position.create.mockRejectedValue(new Error('Validation error'));

      await expect(createPosition({ positionName: 'Invalid' }))
        .rejects.toThrow('Error creating position: Validation error');
    });
  });

  // Tests for updatePosition function
  describe('updatePosition', () => {
    it('should update an existing position', async () => {
      // Mock existing position with an update method
      const mockPosition = { 
        id: 1, 
        positionName: 'Old', 
        update: jest.fn().mockResolvedValue(true) 
      };
      Position.findByPk.mockResolvedValue(mockPosition);
      // Mock that no other position with the new name exists (to avoid duplicates)
      Position.findOne.mockResolvedValue(null);

      const result = await updatePosition(1, { positionName: 'New' });
      
      // Check that the update method was called with the new data
      expect(mockPosition.update).toHaveBeenCalledWith({ positionName: 'New' });
    });

    it('should check for duplicate names', async () => {
      const mockPosition = { id: 1, positionName: 'Old' };
      Position.findByPk.mockResolvedValue(mockPosition);
      // Simulate existing position with the same name (duplicate)
      Position.findOne.mockResolvedValue({ id: 2, positionName: 'Existing' });

      await expect(updatePosition(1, { positionName: 'Existing' }))
        .rejects.toThrow('Position name already exists');
    });

    it('should throw error when position does not exist', async () => {
      Position.findByPk.mockResolvedValue(null);

      await expect(updatePosition(999, { positionName: 'New' }))
        .rejects.toThrow('Position not found');
    });

    it('should throw error when update fails', async () => {
      const mockPosition = { 
        id: 1, 
        update: jest.fn().mockRejectedValue(new Error('DB error')) 
      };
      Position.findByPk.mockResolvedValue(mockPosition);

      await expect(updatePosition(1, { positionName: 'New' }))
        .rejects.toThrow('Error updating position: Position name already exists');
    });
  });

  // Tests for deletePosition function
  describe('deletePosition', () => {
    it('should delete a position without associated users', async () => {
      // Mock position with destroy method
      const mockPosition = { id: 1, destroy: jest.fn() };
      Position.findByPk.mockResolvedValue(mockPosition);
      // Simulate zero associated users
      User.count.mockResolvedValue(0);

      const result = await deletePosition(1);
      
      // Verify transaction usage and destroy call
      expect(sequelize.transaction).toHaveBeenCalled();
      expect(mockPosition.destroy).toHaveBeenCalled();
      // Check returned success message
      expect(result).toEqual({ 
        success: true, 
        message: 'Position deleted successfully' 
      });
    });

    it('should throw error when there are associated users', async () => {
      const mockPosition = { id: 1 };
      Position.findByPk.mockResolvedValue(mockPosition);
      // Simulate one or more associated users
      User.count.mockResolvedValue(1);

      await expect(deletePosition(1))
        .rejects.toThrow('Cannot delete position with associated users');
    });

    it('should throw error when position does not exist', async () => {
      Position.findByPk.mockResolvedValue(null);

      await expect(deletePosition(999))
        .rejects.toThrow('Position not found');
    });

    it('should rollback in case of error', async () => {
      // Mock a transaction object with commit and rollback mocks
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };
      sequelize.transaction.mockResolvedValue(mockTransaction);
      // Simulate an error during findByPk, causing the transaction rollback
      Position.findByPk.mockRejectedValue(new Error('DB error'));

      await expect(deletePosition(1))
        .rejects.toThrow('DB error');
      // Ensure rollback was called
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
