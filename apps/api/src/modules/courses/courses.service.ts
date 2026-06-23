import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  credits: number;
  startDate: Date;
  endDate: Date;
  prerequisites: string[];
  department: string;
  instructor: string;
  maxStudents: number;
  deliveryMethod: string;
  courseTypes: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: Partial<Course>): Promise<Course> {
    // Check if course with same title already exists
    if (!createCourseDto.title) {
      throw new ConflictException('Course title is required');
    }

    const existingCourse = await this.prisma.course.findFirst({
      where: { title: createCourseDto.title },
    });

    if (existingCourse) {
      throw new ConflictException('Course with this title already exists');
    }

    return this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        code: createCourseDto.code!,
        description: createCourseDto.description!,
        credits: createCourseDto.credits!,
        startDate: createCourseDto.startDate!,
        endDate: createCourseDto.endDate!,
        prerequisites: createCourseDto.prerequisites || [],
        department: createCourseDto.department!,
        instructor: createCourseDto.instructor!,
        maxStudents: createCourseDto.maxStudents!,
        deliveryMethod: createCourseDto.deliveryMethod!,
        courseTypes: createCourseDto.courseTypes || [],
        published: false,
      },
    });
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(id: string, updateCourseDto: Partial<Course>): Promise<Course> {
    // Check if course exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    // If updating title, check for duplicates
    if (
      updateCourseDto.title &&
      updateCourseDto.title !== existingCourse.title
    ) {
      const duplicate = await this.prisma.course.findFirst({
        where: { title: updateCourseDto.title },
      });

      if (duplicate) {
        throw new ConflictException('Course with this title already exists');
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: string): Promise<void> {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    await this.prisma.course.delete({
      where: { id },
    });
  }

  async publish(id: string): Promise<Course> {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.update({
      where: { id },
      data: { published: true },
    });
  }
}
