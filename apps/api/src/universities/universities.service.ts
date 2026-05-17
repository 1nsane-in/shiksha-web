import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  CreateCourseDto,
  UpdateCourseDto,
  UploadUniversityDocumentDto,
  UniversityQueryDto,
  UniversityStatus,
} from './universities.dto';

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) {}

  // Generate slug from name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Find all universities with filters
  async findAll(query: UniversityQueryDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.country) {
      where.location = { country: query.country };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { shortName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [universities, total] = await Promise.all([
      this.prisma.university.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          location: true,
          contact: true,
          _count: {
            select: {
              courses: true,
              applications: true,
            },
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

  // Find one university by ID or slug
  async findOne(identifier: string) {
    const university = await this.prisma.university.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        location: true,
        contact: true,
        academic: true,
        recognition: true,
        fees: true,
        infrastructure: true,
        admission: true,
        support: true,
        content: true,
        admin: true,
        courses: {
          where: { isActive: true },
        },
        documents: true,
        _count: {
          select: {
            courses: true,
            applications: true,
          },
        },
      },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return university;
  }

  // Create new university
  async create(dto: CreateUniversityDto) {
    const slug = this.generateSlug(dto.name);

    // Check if slug already exists
    const existing = await this.prisma.university.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException(
        'University with similar name already exists',
      );
    }

    // Validate seat distribution
    const totalSeats =
      dto.academic.governmentSeats +
      dto.academic.managementSeats +
      dto.academic.nriSeats;

    if (totalSeats !== dto.academic.totalSeats) {
      throw new BadRequestException(
        'Seat distribution does not match total seats',
      );
    }

    // Create university with all related data
    const university = await this.prisma.university.create({
      data: {
        slug,
        name: dto.name,
        shortName: dto.shortName,
        establishedYear: dto.establishedYear,
        type: dto.type,
        website: dto.website,
        logo: dto.logo,
        bannerImage: dto.bannerImage,
        status: UniversityStatus.DRAFT,
        location: {
          create: dto.location,
        },
        contact: {
          create: dto.contact,
        },
        academic: {
          create: dto.academic,
        },
        recognition: {
          create: dto.recognition,
        },
        fees: {
          create: dto.fees,
        },
        infrastructure: {
          create: dto.infrastructure,
        },
        admission: {
          create: {
            ...dto.admission,
            applicationDeadline: new Date(dto.admission.applicationDeadline),
          },
        },
        support: {
          create: dto.support,
        },
        content: {
          create: dto.content,
        },
        admin: {
          create: dto.admin,
        },
      },
      include: {
        location: true,
        contact: true,
        academic: true,
        recognition: true,
        fees: true,
        infrastructure: true,
        admission: true,
        support: true,
        content: true,
        admin: true,
      },
    });

    return university;
  }

  // Update university
  async update(id: string, dto: UpdateUniversityDto) {
    await this.findOne(id);

    // If name is being updated, regenerate slug
    let slug: string | undefined;
    if (dto.name) {
      slug = this.generateSlug(dto.name);

      // Check if new slug conflicts
      const existing = await this.prisma.university.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          'University with similar name already exists',
        );
      }
    }

    // Validate seat distribution if academic data is being updated
    if (dto.academic) {
      const totalSeats =
        (dto.academic.governmentSeats || 0) +
        (dto.academic.managementSeats || 0) +
        (dto.academic.nriSeats || 0);

      if (dto.academic.totalSeats && totalSeats !== dto.academic.totalSeats) {
        throw new BadRequestException(
          'Seat distribution does not match total seats',
        );
      }
    }

    // Update university and related data
    const updateData: any = {
      ...(dto.name && { name: dto.name }),
      ...(dto.shortName && { shortName: dto.shortName }),
      ...(dto.establishedYear && { establishedYear: dto.establishedYear }),
      ...(dto.type && { type: dto.type }),
      ...(dto.website && { website: dto.website }),
      ...(dto.logo && { logo: dto.logo }),
      ...(dto.bannerImage && { bannerImage: dto.bannerImage }),
      ...(dto.status && { status: dto.status }),
      ...(slug && { slug }),
    };

    // Update related entities
    if (dto.location) {
      updateData.location = { update: dto.location };
    }
    if (dto.contact) {
      updateData.contact = { update: dto.contact };
    }
    if (dto.academic) {
      updateData.academic = { update: dto.academic };
    }
    if (dto.recognition) {
      updateData.recognition = { update: dto.recognition };
    }
    if (dto.fees) {
      updateData.fees = { update: dto.fees };
    }
    if (dto.infrastructure) {
      updateData.infrastructure = { update: dto.infrastructure };
    }
    if (dto.admission) {
      const admissionData: any = { ...dto.admission };
      if (dto.admission.applicationDeadline) {
        admissionData.applicationDeadline = new Date(
          dto.admission.applicationDeadline,
        );
      }
      updateData.admission = { update: admissionData };
    }
    if (dto.support) {
      updateData.support = { update: dto.support };
    }
    if (dto.content) {
      updateData.content = { update: dto.content };
    }
    if (dto.admin) {
      updateData.admin = { update: dto.admin };
    }

    const university = await this.prisma.university.update({
      where: { id },
      data: updateData,
      include: {
        location: true,
        contact: true,
        academic: true,
        recognition: true,
        fees: true,
        infrastructure: true,
        admission: true,
        support: true,
        content: true,
        admin: true,
      },
    });

    return university;
  }

  // Delete university (soft delete by setting status to INACTIVE)
  async delete(id: string) {
    await this.findOne(id);

    const university = await this.prisma.university.update({
      where: { id },
      data: { status: UniversityStatus.INACTIVE },
    });

    return { message: 'University deleted successfully', university };
  }

  // Update university status
  async updateStatus(id: string, status: UniversityStatus) {
    await this.findOne(id);

    const university = await this.prisma.university.update({
      where: { id },
      data: {
        status,
        ...(status === UniversityStatus.ACTIVE && { verifiedAt: new Date() }),
      },
    });

    return university;
  }

  // Upload document
  async uploadDocument(id: string, dto: UploadUniversityDocumentDto) {
    await this.findOne(id);

    const document = await this.prisma.universityDocument.create({
      data: {
        universityId: id,
        type: dto.type,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
      },
    });

    return document;
  }

  // Get documents
  async getDocuments(id: string) {
    await this.findOne(id);

    const documents = await this.prisma.universityDocument.findMany({
      where: { universityId: id },
      orderBy: { uploadedAt: 'desc' },
    });

    return documents;
  }

  // Delete document
  async deleteDocument(documentId: string) {
    const document = await this.prisma.universityDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.universityDocument.delete({
      where: { id: documentId },
    });

    return { message: 'Document deleted successfully' };
  }

  // Course management
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

    return { message: 'Course deleted successfully' };
  }

  // Get countries
  async getCountries() {
    const locations = await this.prisma.universityLocation.findMany({
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });

    return locations.map((l) => l.country);
  }

  // Get statistics
  async getStatistics() {
    const [
      total,
      active,
      draft,
      underReview,
      byType,
      byCountry,
      recentlyAdded,
    ] = await Promise.all([
      this.prisma.university.count(),
      this.prisma.university.count({ where: { status: 'ACTIVE' } }),
      this.prisma.university.count({ where: { status: 'DRAFT' } }),
      this.prisma.university.count({ where: { status: 'UNDER_REVIEW' } }),
      this.prisma.university.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.universityLocation.groupBy({
        by: ['country'],
        _count: true,
        orderBy: { _count: { country: 'desc' } },
        take: 10,
      }),
      this.prisma.university.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      total,
      active,
      draft,
      underReview,
      byType,
      byCountry,
      recentlyAdded,
    };
  }
}
