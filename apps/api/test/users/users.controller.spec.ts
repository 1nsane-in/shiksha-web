import { Test, TestingModule } from '@nestjs/testing';
import { UsersController, AdminUsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/auth/guards/roles.guard';
import type { AuthenticatedRequest } from '../../src/common/types/request.type';

const mockUsersService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  deactivate: jest.fn(),
  activate: jest.fn(),
};

const mockRequest = {
  user: { id: 'user-1', sub: 'user-1', email: 'test@test.com', role: 'STUDENT' },
} as AuthenticatedRequest;

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('GET /users/profile', () => {
    it('should return user profile', async () => {
      const mockProfile = { id: 'user-1', email: 'test@test.com', name: 'Test' };
      mockUsersService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockRequest, undefined);

      expect(mockUsersService.getProfile).toHaveBeenCalledWith('user-1', undefined);
      expect(result).toEqual(mockProfile);
    });

    it('should pass fields query param to service', async () => {
      mockUsersService.getProfile.mockResolvedValue({ id: 'user-1', email: 'test@test.com' });

      await controller.getProfile(mockRequest, 'email,name');

      expect(mockUsersService.getProfile).toHaveBeenCalledWith('user-1', 'email,name');
    });
  });

  describe('PUT /users/profile', () => {
    it('should update user profile', async () => {
      const dto = { name: 'Updated', phone: '9999999999' };
      mockUsersService.updateProfile.mockResolvedValue({ ...dto, id: 'user-1' });

      const result = await controller.updateProfile(mockRequest, dto);

      expect(mockUsersService.updateProfile).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ ...dto, id: 'user-1' });
    });
  });
});

describe('AdminUsersController', () => {
  let controller: AdminUsersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminUsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AdminUsersController>(AdminUsersController);
  });

  describe('GET /admin/users', () => {
    it('should return paginated users with defaults', async () => {
      const mockResult = { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      mockUsersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(undefined, undefined, undefined, undefined);

      expect(mockUsersService.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should parse query params and pass to service', async () => {
      await controller.findAll('2', '20', 'STUDENT', 'email,name');

      expect(mockUsersService.findAll).toHaveBeenCalledWith(2, 20, 'STUDENT', 'email,name');
    });
  });

  describe('GET /admin/users/:id', () => {
    it('should return user by id', async () => {
      mockUsersService.findOne.mockResolvedValue({ id: 'user-1' });

      const result = await controller.findOne('user-1', undefined);

      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-1', undefined);
      expect(result).toEqual({ id: 'user-1' });
    });

    it('should pass fields to service', async () => {
      await controller.findOne('user-1', 'email,name');

      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-1', 'email,name');
    });
  });

  describe('PUT /admin/users/:id', () => {
    it('should update user', async () => {
      const dto = { name: 'Admin Update' };
      mockUsersService.update.mockResolvedValue({ id: 'user-1', ...dto });

      const result = await controller.update('user-1', dto);

      expect(mockUsersService.update).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ id: 'user-1', ...dto });
    });
  });

  describe('DELETE /admin/users/:id', () => {
    it('should deactivate user', async () => {
      mockUsersService.deactivate.mockResolvedValue({ message: 'User deactivated', user: { id: 'user-1' } });

      const result = await controller.deactivate('user-1');

      expect(mockUsersService.deactivate).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ message: 'User deactivated', user: { id: 'user-1' } });
    });
  });

  describe('PUT /admin/users/:id/activate', () => {
    it('should activate user', async () => {
      mockUsersService.activate.mockResolvedValue({ message: 'User activated', user: { id: 'user-1' } });

      const result = await controller.activate('user-1');

      expect(mockUsersService.activate).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ message: 'User activated', user: { id: 'user-1' } });
    });
  });
});
