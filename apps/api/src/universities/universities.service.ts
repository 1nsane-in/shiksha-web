import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/services/storage.service';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  CreateCourseDto,
  UpdateCourseDto,
  UploadUniversityDocumentDto,
  UniversityQueryDto,
  UniversityStatus,
} from './universities.dto';
import { PaginatorService } from '../common/services/paginator.service';
import { createQueryBuilder } from '../common/helpers/prisma-query-builder';

const UNIVERSITY_INCLUDES = {
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
};

@Injectable()
export class UniversitiesService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
    private storage: StorageService,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async findByIdOrThrow(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return university;
  }

  async findAll(query: UniversityQueryDto) {
    const { page, limit } = this.paginator.parseOptions(
      query.page,
      query.limit,
    );

    const where = createQueryBuilder()
      .where('status', query.status)
      .whereNested('location', 'country', query.country)
      .where('type', query.type)
      .search(query.search, ['name', 'shortName', 'slug'])
      .build();

    const [universities, total] = await Promise.all([
      this.prisma.university.findMany({
        where,
        skip: this.paginator.getSkip({ page, limit }),
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          shortName: true,
          slug: true,
          establishedYear: true,
          type: true,
          status: true,
          logo: true,
          bannerImage: true,
          brochureUrl: true,
          location: {
            select: {
              country: true,
              city: true,
              state: true,
              address: true,
            },
          },
          contact: {
            select: {
              email: true,
              phone: true,
            },
          },
          academic: {
            select: {
              medium: true,
            },
          },
          content: {
            select: {
              gallery: true,
            },
          },
        },
      }),
      this.prisma.university.count({ where }),
    ]);

    return this.paginator.wrapResult(universities, total, { page, limit });
  }

  async findAllAdmin(query: UniversityQueryDto) {
    const { page, limit } = this.paginator.parseOptions(
      query.page,
      query.limit,
    );

    const where = createQueryBuilder()
      .where('status', query.status)
      .whereNested('location', 'country', query.country)
      .where('type', query.type)
      .search(query.search, ['name', 'shortName', 'slug'])
      .build();

    const [universities, total] = await Promise.all([
      this.prisma.university.findMany({
        where,
        skip: this.paginator.getSkip({ page, limit }),
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

    return this.paginator.wrapResult(universities, total, { page, limit });
  }

  async findOne(identifier: string) {
    const university = await this.prisma.university.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        slug: true,
        establishedYear: true,
        type: true,
        status: true,
        logo: true,
        bannerImage: true,
        brochureUrl: true,
        location: {
          select: {
            country: true,
            state: true,
            city: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        contact: {
          select: {
            email: true,
            phone: true,
            admissionOfficeHours: true,
          },
        },
        academic: {
          select: {
            programs: true,
            duration: true,
            medium: true,
            specializations: true,
            intakeMonths: true,
            totalSeats: true,
            governmentSeats: true,
            managementSeats: true,
            nriSeats: true,
          },
        },
        content: {
          select: {
            gallery: true,
          },
        },
        infrastructure: {
          select: {
            hospitalBeds: true,
            departments: true,
            hostelBoys: true,
            hostelGirls: true,
            laboratories: true,
            campusArea: true,
            facilities: true,
            cafeteria: true,
            wifiCampus: true,
            transportation: true,
          },
        },
        admission: {
          select: {
            entranceExams: true,
            minimumMarks: true,
            ageCriteria: true,
            eligibility: true,
            requiredDocuments: true,
            applicationDeadline: true,
            applicationFee: true,
            selectionProcess: true,
          },
        },
        support: {
          select: {
            placementRate: true,
            averagePackage: true,
            visaAssistance: true,
            languageSupport: true,
            counselingServices: true,
            careerGuidance: true,
          },
        },
        courses: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            duration: true,
            fees: true,
            seats: true,
            isActive: true,
          },
        },
      },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return university;
  }

  async findOneAdmin(identifier: string) {
    const university = await this.prisma.university.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: UNIVERSITY_INCLUDES,
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return university;
  }

  async create(dto: CreateUniversityDto) {
    const slug = this.generateSlug(dto.name);

    const existing = await this.prisma.university.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException(
        'University with similar name already exists',
      );
    }

    const totalSeats =
      dto.academic.governmentSeats +
      dto.academic.managementSeats +
      dto.academic.nriSeats;

    if (totalSeats !== dto.academic.totalSeats) {
      throw new BadRequestException(
        'Seat distribution does not match total seats',
      );
    }

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
        brochureUrl: dto.brochureUrl,
        status: UniversityStatus.DRAFT,
        location: { create: dto.location },
        contact: { create: dto.contact },
        academic: { create: dto.academic },
        recognition: { create: dto.recognition },
        fees: { create: dto.fees },
        infrastructure: { create: dto.infrastructure },
        admission: {
          create: {
            ...dto.admission,
            applicationDeadline: new Date(dto.admission.applicationDeadline),
          },
        },
        support: { create: dto.support },
        content: { create: dto.content },
        admin: { create: dto.admin },
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

  async update(id: string, dto: UpdateUniversityDto) {
    await this.findByIdOrThrow(id);

    if (dto.name) {
      const slug = this.generateSlug(dto.name);

      const existing = await this.prisma.university.findFirst({
        where: { slug, NOT: { id } },
      });

      if (existing) {
        throw new ConflictException(
          'University with similar name already exists',
        );
      }
    }

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

    const updateData: Record<string, unknown> = {};
    const scalarFields: (keyof UpdateUniversityDto)[] = [
      'name',
      'shortName',
      'establishedYear',
      'type',
      'website',
      'logo',
      'bannerImage',
      'brochureUrl',
      'status',
    ];

    for (const field of scalarFields) {
      const value = dto[field];
      if (value !== undefined) {
        if (field === 'name') {
          updateData[field] = value;
          updateData.slug = this.generateSlug(value as string);
        } else {
          updateData[field] = value;
        }
      }
    }

    const relationFields: Array<{
      key: keyof UpdateUniversityDto;
      transform?: (val: unknown) => unknown;
    }> = [
      { key: 'location' },
      { key: 'contact' },
      { key: 'academic' },
      { key: 'recognition' },
      { key: 'fees' },
      { key: 'infrastructure' },
      { key: 'support' },
      { key: 'content' },
      { key: 'admin' },
      {
        key: 'admission',
        transform: (val) => {
          const admissionData = { ...(val as Record<string, unknown>) };
          if (admissionData.applicationDeadline) {
            admissionData.applicationDeadline = new Date(
              admissionData.applicationDeadline as string,
            );
          }
          return admissionData;
        },
      },
    ];

    for (const { key, transform } of relationFields) {
      const value = dto[key];
      if (value !== undefined) {
        updateData[key] = { update: transform ? transform(value) : value };
      }
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

  async delete(id: string) {
    await this.findByIdOrThrow(id);

    const university = await this.prisma.university.update({
      where: { id },
      data: { status: UniversityStatus.INACTIVE },
    });

    return { message: 'University deleted successfully', university };
  }

  async updateStatus(id: string, status: UniversityStatus) {
    await this.findByIdOrThrow(id);

    return this.prisma.university.update({
      where: { id },
      data: {
        status,
        ...(status === UniversityStatus.ACTIVE ? { verifiedAt: new Date() } : {}),
      },
    });
  }

  async uploadDocument(id: string, dto: UploadUniversityDocumentDto) {
    await this.findByIdOrThrow(id);

    return this.prisma.universityDocument.create({
      data: {
        universityId: id,
        type: dto.type,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
      },
    });
  }

  async getDocuments(id: string) {
    await this.findByIdOrThrow(id);

    return this.prisma.universityDocument.findMany({
      where: { universityId: id },
      orderBy: { uploadedAt: 'desc' },
    });
  }

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

  async addCourse(universityId: string, dto: CreateCourseDto) {
    await this.findByIdOrThrow(universityId);

    return this.prisma.universityCourse.create({
      data: { ...dto, universityId },
    });
  }

  async updateCourse(courseId: string, dto: UpdateCourseDto) {
    const course = await this.prisma.universityCourse.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.universityCourse.update({
      where: { id: courseId },
      data: dto,
    });
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

  async getCountries() {
    const locations = await this.prisma.universityLocation.findMany({
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });

    return locations.map((l) => l.country);
  }

  async getSignedBrochureUrl(identifier: string) {
    const university = await this.prisma.university.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
      select: { brochureUrl: true },
    });
    if (!university?.brochureUrl) {
      throw new NotFoundException('Brochure not found');
    }
    // Extract key from the public URL (e.g. "https://pub-xxx.r2.dev/brochures/uuid.pdf" → "brochures/uuid.pdf")
    const url = new URL(university.brochureUrl);
    const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    const signedUrl = await this.storage.getSignedUrl(key, 900); // 15 min
    return { url: signedUrl, expiresIn: 900 };
  }

  async getStatistics() {
    const [total, active, draft, underReview, byType, byCountry, recentlyAdded] =
      await Promise.all([
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
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
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

