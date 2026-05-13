import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  CreateCourseDto,
  UpdateCourseDto,
} from './universities.dto';

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, country?: string) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    
    if (country) {
      where.country = country;
    }

    const [universities, total] = await Promise.all([
      this.prisma.university.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          courses: {
            where: { isActive: true },
          },
        },
      }),
      this.prisma.university.count({ where }),
    ]);

    return {
      data: universities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        courses: {
          where: { isActive: true },
        },
      },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return university;
  }

  async create(dto: CreateUniversityDto) {
    const university = await this.prisma.university.create({
      data: dto,
    });

    return university;
  }

  async update(id: string, dto: UpdateUniversityDto) {
    await this.findOne(id);

    const university = await this.prisma.university.update({
      where: { id },
      data: dto,
    });

    return university;
  }

  async delete(id: string) {
    await this.findOne(id);

    const university = await this.prisma.university.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'University deleted', university };
  }

  async addCourse(universityId: string, dto: CreateCourseDto) {
    await this.findOne(universityId);

    const course = await this.prisma.universityCourse.create({
      data: {
        ...dto,
        universityId,
      },
    });

    return course;
  }

  async updateCourse(courseId: string, dto: UpdateCourseDto) {
    const course = await this.prisma.universityCourse.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const updatedCourse = await this.prisma.universityCourse.update({
      where: { id: courseId },
      data: dto,
    });

    return updatedCourse;
  }

  async deleteCourse(courseId: string) {
    const course = await this.prisma.universityCourse.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.prisma.universityCourse.update({
      where: { id: courseId },
      data: { isActive: false },
    });

    return { message: 'Course deleted' };
  }

  async getCountries() {
    const countries = await this.prisma.university.findMany({
      where: { isActive: true },
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });

    return countries.map((u) => u.country);
  }
}
