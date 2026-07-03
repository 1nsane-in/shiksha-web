import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTokenController } from '../../src/notifications/device-token.controller';
import { DeviceTokenService } from '../../src/notifications/device-token.service';
import { RegisterDeviceTokenDto } from '../../src/notifications/dto/device-token.dto';

const mockDeviceTokenService = {
  register: jest.fn(),
  unregister: jest.fn(),
  getUserTokens: jest.fn(),
};

describe('DeviceTokenController', () => {
  let controller: DeviceTokenController;
  let service: typeof mockDeviceTokenService;

  const mockUser = { id: 'user-1', role: 'STUDENT' };
  const mockDto: RegisterDeviceTokenDto = {
    token: 'device-token-abc',
    platform: 'ios',
  };
  const mockTokenRecord = { id: 'token-1', ...mockDto, userId: 'user-1', isActive: true };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceTokenController],
      providers: [
        { provide: DeviceTokenService, useValue: mockDeviceTokenService },
      ],
    }).compile();

    controller = module.get<DeviceTokenController>(DeviceTokenController);
    service = mockDeviceTokenService;
  });

  describe('POST /', () => {
    it('should call register with user id and dto', async () => {
      service.register.mockResolvedValue(mockTokenRecord);

      const result = await controller.register(mockDto, mockUser);

      expect(service.register).toHaveBeenCalledWith(mockUser.id, mockDto);
      expect(result).toEqual(mockTokenRecord);
    });
  });

  describe('DELETE :token', () => {
    it('should call unregister with user id and token', async () => {
      service.unregister.mockResolvedValue({ message: 'Token not found' });

      const result = await controller.unregister('device-token-abc', mockUser);

      expect(service.unregister).toHaveBeenCalledWith(
        mockUser.id,
        'device-token-abc',
      );
      expect(result).toEqual({ message: 'Token not found' });
    });
  });

  describe('GET /', () => {
    it('should call getUserTokens with user id', async () => {
      service.getUserTokens.mockResolvedValue([mockTokenRecord]);

      const result = await controller.getMyTokens(mockUser);

      expect(service.getUserTokens).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([mockTokenRecord]);
    });
  });
});
