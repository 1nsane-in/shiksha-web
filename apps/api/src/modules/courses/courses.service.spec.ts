import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

const mockPrismaService = {
  course: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course successfully', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'An introductory course to computer science fundamentals',
        credits: 10,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        prerequisites: ['Programming Fundamentals', 'Data Structures'],
        department: 'Computer Science',
        instructor: 'Dr. John Smith',
        maxStudents: 30,
        deliveryMethod: 'Online',
        courseTypes: ['Lecture', 'Lab'],
      };

      const mockCourse = {
        id: '1',
        ...createCourseDto,
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.course.findUnique.mockResolvedValue(null);
      mockPrismaService.course.create.mockResolvedValue(mockCourse);

      const result = await service.create(createCourseDto);
      expect(result).toEqual(mockCourse);
      expect(mockPrismaService.course.create).toHaveBeenCalledWith({
        data: {
          ...createCourseDto,
          published: false,
        },
      });
    });

    it('should throw ConflictException when course with same title already exists', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'An introductory course to computer science fundamentals',
        credits: 10,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        prerequisites: ['Programming Fundamentals', 'Data Structures'],
        department: 'Computer Science',
        instructor: 'Dr. John Smith',
        maxStudents: 30,
        deliveryMethod: 'Online',
        courseTypes: ['Lecture', 'Lab'],
      };

      const mockExistingCourse = {
        id: '1',
        ...createCourseDto,
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.course.findUnique.mockResolvedValue(mockExistingCourse);

      await expect(service.create(createCourseDto)).rejects.toThrow(
        new ConflictException('Course with this title already exists'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all published courses', async () => {
      const mockCourses = [
        {
          id: '1',
          title: 'Introduction to Computer Science',
          code: 'CS101',
          description:
            'An introductory course to computer science fundamentals',
          credits: 10,
          startDate: new Date('2023-09-01'),
          endDate: new Date('2023-12-31'),
          prerequisites: ['Programming Fundamentals', 'Data Structures'],
          department: 'Computer Science',
          instructor: 'Dr. John Smith',
          maxStudents: 30,
          deliveryMethod: 'Online',
          courseTypes: ['Lecture', 'Lab'],
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.course.findMany.mockResolvedValue(mockCourses);

      const result = await service.findAll();
      expect(result).toEqual(mockCourses);
      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a course by ID', async () => {
      const mockCourse = {
        id: '1',
        title: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'An introductory course to computer science fundamentals',
        credits: 10,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        prerequisites: ['Programming Fundamentals', 'Data Structures'],
        department: 'Computer Science',
        instructor: 'Dr. John Smith',
        maxStudents: 30,
        deliveryMethod: 'Online',
        courseTypes: ['Lecture', 'Lab'],
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);

      const result = await service.findOne('1');
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException when course not found', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        new NotFoundException('Course not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a course successfully', async () => {
      const updateCourseDto: UpdateCourseDto = {
        title: 'Advanced Computer Science',
        description: 'An advanced course to computer science',
        credits: 12,
      };

      const mockExistingCourse = {
        id: '1',
        title: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'An introductory course to computer science fundamentals',
        credits: 10,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        prerequisites: ['Programming Fundamentals', 'Data Structures'],
        department: 'Computer Science',
        instructor: 'Dr. John Smith',
        maxStudents: 30,
        deliveryMethod: 'Online',
        courseTypes: ['Lecture', 'Lab'],
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedCourse = {
        ...mockExistingCourse,
        ...updateCourseDto,
        updatedAt: new Date(),
      };

      mockPrismaService.course.findUnique.mockImplementation((args) => {
        if (args.where.id === '1') return Promise.resolve(mockExistingCourse);
        return Promise.resolve(null);
      });
      mockPrismaService.course.update.mockResolvedValue(mockUpdatedCourse);

      const result = await service.update('1', updateCourseDto);
      expect(result).toEqual(mockUpdatedCourse);
    });

    it('should throw NotFoundException when trying to update non-existing course', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(
        new NotFoundException('Course not found'),
      );
    });

    it('should throw ConflictException when updating title to an existing title', async () => {
      const updateCourseDto: UpdateCourseDto = {
        title: 'Advanced Computer Science',
      };

      const mockExistingCourse = {
        id: '1',
        title: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'An introductory course to computer science fundamentals',
        credits: 10,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        prerequisites: ['Programming Fundamentals', 'Data Structures'],
        department: 'Computer Science',
        instructor: 'Dr. John Smith',
        maxStudents: 30,
        deliveryMethod: 'Online',
        courseTypes: ['Lecture', 'Lab'],
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockDuplicateCourse = {
        id: '2',
        ...updateCourseDto,
        code: 'CS201',
        description: 'An advanced course to computer science',
        credits: 12,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        prerequisites: [],
        department: 'Computer Science',
        instructor: 'Dr. Jane Doe',
        maxStudents: 35,
        deliveryMethod: 'Hybrid',
        courseTypes: ['Lecture', 'Lab', 'Seminar'],
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.course.findUnique.mockImplementation((args) => {
        if (args.where.id === '1') return Promise.resolve(mockExistingCourse);
        if (args.where.title === 'Advanced Computer Science')
          return Promise.resolve(mockDuplicateCourse);
        return Promise.resolve(null);
      });

      await expect(service.update('1', updateCourseDto)).rejects.toThrow(
        new ConflictException('Course with this title already exists'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a course successfully', async () => {
      const mockCourse = {
        id: '1',
        title: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'An introductory course to computer science fundamentals',
        credits: 10,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        prerequisites: ['Programming Fundamentals', 'Data Structures'],
        department: 'Computer Science',
        instructor: 'Dr. John Smith',
        maxStudents: 30,
        deliveryMethod: 'Online',
        courseTypes: ['Lecture', 'Lab'],
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockPrismaService.course.delete.mockResolvedValue(undefined);

      await expect(service.remove('1')).resolves.not.toThrow();
      expect(mockPrismaService.course.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when trying to delete non-existing course', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(
        new NotFoundException('Course not found'),
      );
    });
  });

  describe('publish', () => {
    it('should publish a course successfully', async () => {
      const mockCourse = {
        id: '1',
        title: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'An introductory course to computer science fundamentals',
        credits: 10,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        prerequisites: ['Programming Fundamentals', 'Data Structures'],
        department: 'Computer Science',
        instructor: 'Dr. John Smith',
        maxStudents: 30,
        deliveryMethod: 'Online',
        courseTypes: ['Lecture', 'Lab'],
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPublishedCourse = {
        ...mockCourse,
        published: true,
        updatedAt: new Date(),
      };

      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockPrismaService.course.update.mockResolvedValue(mockPublishedCourse);

      const result = await service.publish('1');
      expect(result).toEqual(mockPublishedCourse);
    });

    it('should throw NotFoundException when trying to publish non-existing course', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.publish('1')).rejects.toThrow(
        new NotFoundException('Course not found'),
      );
    });
  });
});
