import { Test, TestingModule } from '@nestjs/testing';
import { ExamsController } from '../../src/exams/exams.controller';
import { ExamsService } from '../../src/exams/exams.service';

const mockExamsService = {
  scheduleExam: jest.fn(),
  declareResult: jest.fn(),
  getMyExam: jest.fn(),
  getExamByApplication: jest.fn(),
  getAllExams: jest.fn(),
};

describe('ExamsController', () => {
  let controller: ExamsController;
  let service: typeof mockExamsService;

  const mockUser = { id: 'user-1', role: 'ADMIN' };
  const mockStudentUser = { id: 'user-2', role: 'STUDENT' };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamsController],
      providers: [{ provide: ExamsService, useValue: mockExamsService }],
    }).compile();

    controller = module.get<ExamsController>(ExamsController);
    service = mockExamsService;
  });

  describe('POST /schedule', () => {
    it('should call scheduleExam with admin id and dto', async () => {
      const dto = {
        applicationId: 'app-1',
        examDate: '2026-06-15',
        examSubject: 'Biology',
        examCenter: 'Center A',
      };
      service.scheduleExam.mockResolvedValue({ id: 'exam-1' });

      const result = await controller.schedule(dto, mockUser);

      expect(service.scheduleExam).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ id: 'exam-1' });
    });
  });

  describe('POST /declare-result', () => {
    it('should call declareResult with admin id and dto', async () => {
      const dto = { examId: 'exam-1', result: 'PASSED', remarks: 'Good' };
      service.declareResult.mockResolvedValue({ id: 'exam-1', result: 'PASSED' });

      const result = await controller.declareResult(dto, mockUser);

      expect(service.declareResult).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ id: 'exam-1', result: 'PASSED' });
    });
  });

  describe('GET /my', () => {
    it('should call getMyExam with user id', async () => {
      service.getMyExam.mockResolvedValue({ id: 'exam-1' });

      const result = await controller.getMyExam(mockStudentUser);

      expect(service.getMyExam).toHaveBeenCalledWith('user-2');
      expect(result).toEqual({ id: 'exam-1' });
    });
  });

  describe('GET /application/:applicationId', () => {
    it('should call getExamByApplication with params', async () => {
      service.getExamByApplication.mockResolvedValue({ id: 'exam-1' });

      const result = await controller.getByApplication('app-1', mockStudentUser);

      expect(service.getExamByApplication).toHaveBeenCalledWith('app-1', 'user-2', 'STUDENT');
      expect(result).toEqual({ id: 'exam-1' });
    });
  });

  describe('GET /admin/all', () => {
    it('should call getAllExams with default pagination', async () => {
      service.getAllExams.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 });

      const result = await controller.getAll(undefined, undefined);

      expect(service.getAllExams).toHaveBeenCalledWith(1, 20);
      expect(result.totalPages).toBe(0);
    });

    it('should call getAllExams with custom pagination', async () => {
      service.getAllExams.mockResolvedValue({ items: [], total: 0, page: 2, limit: 10, totalPages: 0 });

      const result = await controller.getAll('2', '10');

      expect(service.getAllExams).toHaveBeenCalledWith(2, 10);
      expect(result.page).toBe(2);
    });
  });
});
