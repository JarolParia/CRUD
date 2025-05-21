const {
  createUser,
  getallUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../src/services/userService');
const { User } = require('../src/models');
const { hashPassword } = require('../src/utils/bcryptHelper');

// Mock models and utils
jest.mock('../src/models');
jest.mock('../src/utils/bcryptHelper');

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a user with hashed password', async () => {
        const mockUser = { id: 1, email: 'test@example.com' };
        const mockData = { email: 'test@example.com', password: '123456' };
        User.create.mockResolvedValue(mockUser);
        hashPassword.mockResolvedValue('hashed123');

        const result = await createUser(mockData);
        
        expect(hashPassword).toHaveBeenCalledWith('123456');
        expect(User.create).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'hashed123'
        });
        expect(result).toEqual(mockUser);
        });

        it('should throw error when creation fails', async () => {
        User.create.mockRejectedValue(new Error('Validation error'));
        hashPassword.mockResolvedValue('hashed123');

        await expect(createUser({ email: 'test@example.com', password: '123456' }))
            .rejects.toThrow('Validation error');
        });
    });

    describe('getallUsers', () => {
        it('should return paginated users with their positions', async () => {
        const mockUsers = {
            count: 2,
            rows: [
            { id: 1, name: 'User 1', position: { id: 1 } },
            { id: 2, name: 'User 2', position: { id: 2 } }
            ]
        };
        User.findAndCountAll.mockResolvedValue(mockUsers);

        const result = await getallUsers(10, 0);
        
        expect(User.findAndCountAll).toHaveBeenCalledWith({
            include: ['position'],
            limit: 10,
            offset: 0
        });
        expect(result).toEqual(mockUsers);
        });

        it('should throw error when query fails', async () => {
        User.findAndCountAll.mockRejectedValue(new Error('DB error'));

        await expect(getallUsers(10, 0))
            .rejects.toThrow('Error fetching users:DB error');
        });
    });

    describe('getUserById', () => {
        it('should return a user with their position', async () => {
        const mockUser = { id: 1, name: 'Test User', position: { id: 1 } };
        User.findByPk.mockResolvedValue(mockUser);

        const result = await getUserById(1);
        
        expect(User.findByPk).toHaveBeenCalledWith(1, { include: ['position'] });
        expect(result).toEqual(mockUser);
        });

        it('should throw error when user does not exist', async () => {
        User.findByPk.mockResolvedValue(null);

        await expect(getUserById(999))
            .rejects.toThrow('User not found');
        });

        it('should throw error when query fails', async () => {
        User.findByPk.mockRejectedValue(new Error('DB error'));

        await expect(getUserById(1))
            .rejects.toThrow('Error fetching user:DB error');
        });
    });

    describe('updateUser', () => {
        it('should update an existing user', async () => {
        const mockUser = { 
            id: 1, 
            update: jest.fn().mockResolvedValue(true) 
        };
        User.findByPk.mockResolvedValue(mockUser);
        hashPassword.mockResolvedValue('newhashed');

        const result = await updateUser(1, { Password: 'newpass' });
        
        expect(hashPassword).toHaveBeenCalledWith('newpass');
        expect(mockUser.update).toHaveBeenCalledWith({ Password: 'newhashed' });
        });

        it('should update without hashing if password does not change', async () => {
        const mockUser = { 
            id: 1, 
            update: jest.fn().mockResolvedValue(true) 
        };
        User.findByPk.mockResolvedValue(mockUser);

        await updateUser(1, { name: 'New Name' });
        
        expect(hashPassword).not.toHaveBeenCalled();
        expect(mockUser.update).toHaveBeenCalledWith({ name: 'New Name' });
        });

        it('should throw error when user does not exist', async () => {
        User.findByPk.mockResolvedValue(null);

        await expect(updateUser(999, { name: 'New Name' }))
            .rejects.toThrow('User not found');
        });

        it('should throw error when update fails', async () => {
        const mockUser = { 
            id: 1, 
            update: jest.fn().mockRejectedValue(new Error('DB error')) 
        };
        User.findByPk.mockResolvedValue(mockUser);

        await expect(updateUser(1, { name: 'New Name' }))
            .rejects.toThrow('Error updating user:DB error');
        });
    });

    describe('deleteUser', () => {
        it('should delete an existing user', async () => {
        const mockUser = { 
            id: 1, 
            destroy: jest.fn().mockResolvedValue(true) 
        };
        User.findByPk.mockResolvedValue(mockUser);

        const result = await deleteUser(1);
        
        expect(mockUser.destroy).toHaveBeenCalled();
        expect(result).toEqual(mockUser);
        });

        it('should throw error when user does not exist', async () => {
        User.findByPk.mockResolvedValue(null);

        await expect(deleteUser(999))
            .rejects.toThrow('User not found');
        });

        it('should throw error when deletion fails', async () => {
        const mockUser = { 
            id: 1, 
            destroy: jest.fn().mockRejectedValue(new Error('DB error')) 
        };
        User.findByPk.mockResolvedValue(mockUser);

        await expect(deleteUser(1))
            .rejects.toThrow('Error deleting user:DB error');
        });
    });
});
