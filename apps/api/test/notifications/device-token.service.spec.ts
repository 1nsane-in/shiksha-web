import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTokenService } from '../../src/notifications/device-token.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RegisterDeviceTokenDto } from '../../src/notifications/dto/device-token.dto';

const mockPrisma = {
  deviceToken: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('DeviceTokenService', () => {
  let service: DeviceTokenService;
  let prisma: typeof mockPrisma;

  const userId = 'user-1';
  const dto: RegisterDeviceTokenDto = {
    token: 'device-token-abc',
    platform: 'ios',
  };

  const existingToken = {
    id: 'token-1',
    userId,
    token: 'device-token-abc',
    platform: 'android',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceTokenService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DeviceTokenService>(DeviceTokenService);
    prisma = mockPrisma;
  });

  describe('register', () => {
    it('should update existing token when already registered', async () => {
      prisma.deviceToken.findFirst.mockResolvedValue(existingToken);
      prisma.deviceToken.update.mockResolvedValue({
        ...existingToken,
        platform: 'ios',
      });

      const result = await service.register(userId, dto);

      expect(prisma.deviceToken.findFirst).toHaveBeenCalledWith({
        where: { userId, token: dto.token },
      });
      expect(prisma.deviceToken.update).toHaveBeenCalledWith({
        where: { id: existingToken.id },
        data: { isActive: true, platform: dto.platform },
      });
      expect(result).toEqual({ ...existingToken, platform: 'ios' });
    });

    it('should create new token when not found', async () => {
      prisma.deviceToken.findFirst.mockResolvedValue(null);
      prisma.deviceToken.create.mockResolvedValue(existingToken);

      const result = await service.register(userId, dto);

      expect(prisma.deviceToken.create).toHaveBeenCalledWith({
        data: {
          userId,
          token: dto.token,
          platform: dto.platform,
        },
      });
      expect(result).toEqual(existingToken);
    });
  });

  describe('unregister', () => {
    it('should set isActive to false when token found', async () => {
      prisma.deviceToken.findFirst.mockResolvedValue(existingToken);
      prisma.deviceToken.update.mockResolvedValue({
        ...existingToken,
        isActive: false,
      });

      const result = await service.unregister(userId, 'device-token-abc');

      expect(prisma.deviceToken.update).toHaveBeenCalledWith({
        where: { id: existingToken.id },
        data: { isActive: false },
      });
      expect(result).toEqual({ ...existingToken, isActive: false });
    });

    it('should return message when token not found', async () => {
      prisma.deviceToken.findFirst.mockResolvedValue(null);

      const result = await service.unregister(userId, 'unknown-token');

      expect(result).toEqual({ message: 'Token not found' });
    });
  });

  describe('getUserTokens', () => {
    it('should return active tokens', async () => {
      prisma.deviceToken.findMany.mockResolvedValue([existingToken]);

      const result = await service.getUserTokens(userId);

      expect(prisma.deviceToken.findMany).toHaveBeenCalledWith({
        where: { userId, isActive: true },
      });
      expect(result).toEqual([existingToken]);
    });
  });

  describe('getActiveTokens', () => {
    it('should return string array of token values', async () => {
      prisma.deviceToken.findMany.mockResolvedValue([
        { token: 'token-1' },
        { token: 'token-2' },
      ]);

      const result = await service.getActiveTokens(userId);

      expect(prisma.deviceToken.findMany).toHaveBeenCalledWith({
        where: { userId, isActive: true },
        select: { token: true },
      });
      expect(result).toEqual(['token-1', 'token-2']);
    });
  });
});
