import { Test, TestingModule } from '@nestjs/testing';
import { LettersController } from '../../src/letters/letters.controller';
import { LettersService } from '../../src/letters/letters.service';
import { UploadLetterDto, UpdateLetterDto } from '../../src/letters/dto/letter.dto';

const mockLettersService = {
  uploadAdmissionLetter: jest.fn(),
  getAdmissionLetter: jest.fn(),
  getMyAdmissionLetter: jest.fn(),
  downloadAdmissionLetter: jest.fn(),
  uploadInvitationLetter: jest.fn(),
  getInvitationLetter: jest.fn(),
  getMyInvitationLetter: jest.fn(),
  downloadInvitationLetter: jest.fn(),
  updateInvitationLetter: jest.fn(),
  approveInvitationLetterAccess: jest.fn(),
};

describe('LettersController', () => {
  let controller: LettersController;
  let service: typeof mockLettersService;

  const mockUser = { id: 'user-1', role: 'ADMIN' };
  const mockDto: UploadLetterDto = {
    applicationId: 'app-1',
    fileUrl: 'https://example.com/letter.pdf',
    fileName: 'letter.pdf',
  };
  const mockResult = { id: 'letter-1', ...mockDto };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LettersController],
      providers: [
        { provide: LettersService, useValue: mockLettersService },
      ],
    }).compile();

    controller = module.get<LettersController>(LettersController);
    service = mockLettersService;
  });

  describe('POST admission', () => {
    it('should call uploadAdmissionLetter with admin id and dto', async () => {
      service.uploadAdmissionLetter.mockResolvedValue(mockResult);

      const result = await controller.uploadAdmissionLetter(mockDto, mockUser);

      expect(service.uploadAdmissionLetter).toHaveBeenCalledWith(
        mockUser.id,
        mockDto,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('GET admission/:applicationId', () => {
    it('should call getAdmissionLetter with params', async () => {
      service.getAdmissionLetter.mockResolvedValue(mockResult);

      const result = await controller.getAdmissionLetter('app-1', mockUser);

      expect(service.getAdmissionLetter).toHaveBeenCalledWith(
        'app-1',
        mockUser.id,
        mockUser.role,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('GET admission/my', () => {
    it('should call getMyAdmissionLetter with user id', async () => {
      service.getMyAdmissionLetter.mockResolvedValue(mockResult);

      const result = await controller.getMyAdmissionLetter(mockUser);

      expect(service.getMyAdmissionLetter).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockResult);
    });
  });

  describe('POST admission/:applicationId/download', () => {
    it('should call downloadAdmissionLetter', async () => {
      service.downloadAdmissionLetter.mockResolvedValue(mockResult);

      const result = await controller.downloadAdmissionLetter('app-1');

      expect(service.downloadAdmissionLetter).toHaveBeenCalledWith('app-1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('POST invitation', () => {
    it('should call uploadInvitationLetter with admin id and dto', async () => {
      service.uploadInvitationLetter.mockResolvedValue(mockResult);

      const result = await controller.uploadInvitationLetter(mockDto, mockUser);

      expect(service.uploadInvitationLetter).toHaveBeenCalledWith(
        mockUser.id,
        mockDto,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('GET invitation/:applicationId', () => {
    it('should call getInvitationLetter with params', async () => {
      service.getInvitationLetter.mockResolvedValue(mockResult);

      const result = await controller.getInvitationLetter('app-1', mockUser);

      expect(service.getInvitationLetter).toHaveBeenCalledWith(
        'app-1',
        mockUser.id,
        mockUser.role,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('GET invitation/my', () => {
    it('should call getMyInvitationLetter with user id', async () => {
      service.getMyInvitationLetter.mockResolvedValue(mockResult);

      const result = await controller.getMyInvitationLetter(mockUser);

      expect(service.getMyInvitationLetter).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockResult);
    });
  });

  describe('POST invitation/:applicationId/download', () => {
    it('should call downloadInvitationLetter', async () => {
      service.downloadInvitationLetter.mockResolvedValue(mockResult);

      const result = await controller.downloadInvitationLetter('app-1');

      expect(service.downloadInvitationLetter).toHaveBeenCalledWith('app-1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('PATCH invitation/:id', () => {
    it('should call updateInvitationLetter with id and dto', async () => {
      const updateDto: UpdateLetterDto = { isDownloadable: true };
      const updated = { ...mockResult, ...updateDto };
      service.updateInvitationLetter.mockResolvedValue(updated);

      const result = await controller.updateInvitationLetter('inv-1', updateDto);

      expect(service.updateInvitationLetter).toHaveBeenCalledWith(
        'inv-1',
        updateDto,
      );
      expect(result).toEqual(updated);
    });
  });

  describe('POST invitation/:applicationId/approve-access', () => {
    it('should call approveInvitationLetterAccess', async () => {
      const msg = {
        message: 'Invitation letter access approved. Stage 5 unlocked.',
      };
      service.approveInvitationLetterAccess.mockResolvedValue(msg);

      const result = await controller.approveInvitationAccess('app-1');

      expect(service.approveInvitationLetterAccess).toHaveBeenCalledWith(
        'app-1',
      );
      expect(result).toEqual(msg);
    });
  });
});
