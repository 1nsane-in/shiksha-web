import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface Section {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSectionDto: Partial<Section>): Promise<Section> {
    // Check if section with same title already exists for the course
    const existingSection = await this.prisma.section.findUnique({
      where: { 
        courseId_title: {
          courseId: createSectionDto.courseId as string,
          title: createSectionDto.title as string
        }
      },
    });

    if (existingSection) {
      throw new ConflictException('Section with this title already exists for this course');
    }

    return this.prisma.section.create({
      data: {
        ...createSectionDto,
      },
    });
  }

  async findAll(): Promise<Section[]> {
    return this.prisma.section.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section;
  }

  async update(id: string, updateSectionDto: Partial<Section>): Promise<Section> {
    // Check if section exists
    const existingSection = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      throw new NotFoundException('Section not found');
    }

    // Check if updating title for same course would cause conflict
    if (updateSectionDto.title && updateSectionDto.title !== existingSection.title) {
      const duplicate = await this.prisma.section.findUnique({
        where: { 
          courseId_title: {
            courseId: existingSection.courseId,
            title: updateSectionDto.title,
          }
        },
      });

      if (duplicate) {
        throw new ConflictException('Section with this title already exists for this course');
      }
    }

    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
    });
  }

  async remove(id: string): Promise<void> {
    const existingSection = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      throw new NotFoundException('Section not found');
    }

    await this.prisma.section.delete({
      where: { id },
    });
  }
}