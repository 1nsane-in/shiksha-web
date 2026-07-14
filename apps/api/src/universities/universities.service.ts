import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/services/storage.service';
import { RedisService } from '../redis/redis.service';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  CreateCourseDto,
  UpdateCourseDto,
  UploadUniversityDocumentDto,
  UniversityQueryDto,
  UniversityStatus,
  UniversityType,
} from './universities.dto';
import { PaginatorService } from '../common/services/paginator.service';
import { parseFields, ALLOWED_UNIVERSITY_FIELDS } from '../common/helpers/field-selection';
import { Prisma } from '@prisma/client';

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
    private redis: RedisService,
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

  private buildUniversitySelect(fields?: string) {
    // If no fields specified, return default selection
    if (!fields) {
      return {
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
        website: true,
        location: { select: { country: true, city: true, state: true } },
        contact: { select: { email: true, phone: true } },
        academic: { select: { medium: true } },
      };
    }

    // Parse requested fields
    const fieldList = fields.split(',').map(f => f.trim()).filter(Boolean);
    const select: any = {};

    // Always include id
    select.id = true;

    // Simple fields
    const simpleFields = ['name', 'shortName', 'slug', 'logo', 'bannerImage', 'brochureUrl', 'website', 'establishedYear', 'type', 'status', 'createdAt', 'updatedAt'];
    for (const field of simpleFields) {
      if (fieldList.includes(field)) {
        select[field] = true;
      }
    }

    // Nested fields
    if (fieldList.some(f => f.startsWith('location'))) {
      select.location = { select: {} };
      if (fieldList.includes('location.country')) select.location.select.country = true;
      if (fieldList.includes('location.city')) select.location.select.city = true;
      if (fieldList.includes('location.state')) select.location.select.state = true;
      if (Object.keys(select.location.select).length === 0) {
        select.location.select = { country: true, city: true, state: true };
      }
    }

    if (fieldList.some(f => f.startsWith('contact'))) {
      select.contact = { select: {} };
      if (fieldList.includes('contact.email')) select.contact.select.email = true;
      if (fieldList.includes('contact.phone')) select.contact.select.phone = true;
      if (Object.keys(select.contact.select).length === 0) {
        select.contact.select = { email: true, phone: true };
      }
    }

    if (fieldList.some(f => f.startsWith('academic'))) {
      select.academic = { select: {} };
      if (fieldList.includes('academic.medium')) select.academic.select.medium = true;
      if (fieldList.includes('academic.programs')) select.academic.select.programs = true;
      if (Object.keys(select.academic.select).length === 0) {
        select.academic.select = { medium: true };
      }
    }

    return select;
  }

  async findAll(query: UniversityQueryDto) {
    const { page, limit } = this.paginator.parseOptions(
      query.page,
      query.limit,
    );

    // ponytail: cache busted v2 after seeding
    const cacheKey = `universities:list:v2:${page}:${limit}:${query.status || 'all'}:${query.country || 'all'}:${query.type || 'all'}:${query.search || 'none'}:${query.fields || 'default'}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const where: Prisma.UniversityWhereInput = {};
        
        if (query.status) {
          where.status = query.status;
        }
        
        if (query.country) {
          where.location = { country: query.country };
        }
        
        if (query.type) {
          where.type = query.type;
        }
        
        if (query.search) {
          where.OR = [
            { name: { contains: query.search, mode: 'insensitive' } },
            { shortName: { contains: query.search, mode: 'insensitive' } },
            { slug: { contains: query.search, mode: 'insensitive' } },
          ];
        }

        const select = this.buildUniversitySelect(query.fields);

        const [universities, total] = await Promise.all([
          this.prisma.university.findMany({
            where,
            skip: this.paginator.getSkip({ page, limit }),
            take: limit,
            orderBy: { createdAt: 'desc' },
            select,
          }),
          this.prisma.university.count({ where }),
        ]);

        return this.paginator.wrapResult(universities, total, { page, limit });
      },
      3600, // Cache for 1 hour
    );
  }

  async findAllAdmin(query: UniversityQueryDto) {
    const { page, limit } = this.paginator.parseOptions(
      query.page,
      query.limit,
    );

    const where: Prisma.UniversityWhereInput = {};
    
    if (query.status) {
      where.status = query.status;
    }
    
    if (query.country) {
      where.location = { country: query.country };
    }
    
    if (query.type) {
      where.type = query.type;
    }
    
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { shortName: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

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
    return this.redis.getOrSet(
      `university:${identifier}`,
      async () => {
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
      },
      1800, // Cache for 30 minutes
    );
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
    if (!dto.name) {
      throw new ConflictException('University name is required');
    }
    const slug = this.generateSlug(dto.name);

    const existing = await this.prisma.university.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException(
        'University with similar name already exists',
      );
    }

    const university = await this.prisma.university.create({
      data: {
        slug,
        name: dto.name,
        shortName: dto.shortName ?? dto.name,
        establishedYear: dto.establishedYear ?? new Date().getFullYear(),
        type: dto.type ?? UniversityType.GOVERNMENT,
        website: dto.website ?? '',
        logo: dto.logo,
        bannerImage: dto.bannerImage,
        brochureUrl: dto.brochureUrl,
        status: UniversityStatus.DRAFT,
        location: dto.location
          ? { create: this.sanitizeLocation(dto.location) as any }
          : undefined,
        contact: dto.contact
          ? { create: this.sanitizeContact(dto.contact) as any }
          : undefined,
        academic: dto.academic
          ? { create: this.sanitizeAcademic(dto.academic) as any }
          : undefined,
        recognition: dto.recognition
          ? { create: dto.recognition as any }
          : undefined,
        fees: dto.fees ? { create: { ...dto.fees } as any } : undefined,
        infrastructure: dto.infrastructure
          ? { create: this.sanitizeInfrastructure(dto.infrastructure) as any }
          : undefined,
        admission: dto.admission
          ? { create: this.sanitizeAdmission(dto.admission) }
          : undefined,
        support: dto.support ? { create: dto.support as any } : undefined,
        content: dto.content
          ? { create: this.sanitizeContent(dto.content) as any }
          : undefined,
      },
    });

    // Invalidate university list cache
    await this.redis.deletePattern('universities:list:*');

    return university;
  }

  private sanitizeLocation(loc: any) {
    return {
      country: loc.country ?? '',
      state: loc.state ?? '',
      city: loc.city ?? '',
      address: loc.address ?? '',
      latitude: loc.latitude,
      longitude: loc.longitude,
    };
  }

  private sanitizeContact(con: any) {
    return {
      email: con.email ?? '',
      phone: con.phone ?? '',
      admissionOfficeHours: con.admissionOfficeHours ?? '',
    };
  }

  private sanitizeAcademic(ac: any) {
    return {
      programs: ac.programs ?? [],
      duration: ac.duration ?? '',
      medium: ac.medium ?? '',
      specializations: ac.specializations ?? [],
      intakeMonths: ac.intakeMonths ?? [],
      totalSeats: ac.totalSeats ?? 0,
      governmentSeats: ac.governmentSeats ?? 0,
      managementSeats: ac.managementSeats ?? 0,
      nriSeats: ac.nriSeats ?? 0,
      curriculumType: ac.curriculumType,
      clinicalTraining: ac.clinicalTraining,
    };
  }

  private sanitizeInfrastructure(inf: any) {
    return {
      hospitalBeds: inf.hospitalBeds,
      departments: inf.departments ?? [],
      librarySize: inf.librarySize,
      hostelBoys: inf.hostelBoys ?? 0,
      hostelGirls: inf.hostelGirls ?? 0,
      laboratories: inf.laboratories ?? [],
      campusArea: inf.campusArea,
      facilities: inf.facilities ?? [],
      cafeteria: inf.cafeteria ?? false,
      wifiCampus: inf.wifiCampus ?? false,
      transportation: inf.transportation ?? false,
    };
  }

  private sanitizeAdmission(adm: any) {
    return {
      ...adm,
      applicationDeadline: adm.applicationDeadline
        ? new Date(adm.applicationDeadline)
        : undefined,
      programEligibility: adm.programEligibility,
    };
  }

  private sanitizeContent(con: any) {
    return {
      shortDescription: con.shortDescription ?? '',
      longDescription: con.longDescription ?? '',
      highlights: con.highlights ?? [],
      whyChooseUs: con.whyChooseUs,
      gallery: con.gallery ?? [],
      virtualTour: con.virtualTour,
    };
  }

  async update(id: string, dto: UpdateUniversityDto) {
    const existing = await this.findByIdOrThrow(id);

    // Delete old files from R2 before replacing
    if (dto.logo !== undefined && existing.logo && dto.logo !== existing.logo) {
      await this.storage.deleteFromUrl(existing.logo).catch(() => {});
    }
    if (dto.bannerImage !== undefined && existing.bannerImage && dto.bannerImage !== existing.bannerImage) {
      await this.storage.deleteFromUrl(existing.bannerImage).catch(() => {});
    }

    if (dto.name) {
      const slug = this.generateSlug(dto.name);

      const slugConflict = await this.prisma.university.findFirst({
        where: { slug, NOT: { id } },
      });

      if (slugConflict) {
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
      'studentDemographics',
      'socialLinks',
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

    // Invalidate caches
    await this.redis.del(`university:${id}`);
    await this.redis.deletePattern('universities:list:*');

    return university;
  }

  async delete(id: string) {
    await this.findByIdOrThrow(id);

    const university = await this.prisma.university.update({
      where: { id },
      data: { status: UniversityStatus.INACTIVE },
    });

    // Invalidate caches
    await this.redis.del(`university:${id}`);
    await this.redis.deletePattern('universities:list:*');

    return { message: 'University deleted successfully', university };
  }

  async updateStatus(id: string, status: UniversityStatus) {
    await this.findByIdOrThrow(id);

    const result = await this.prisma.university.update({
      where: { id },
      data: {
        status,
        ...(status === UniversityStatus.ACTIVE
          ? { verifiedAt: new Date() }
          : {}),
      },
    });

    // Invalidate caches
    await this.redis.del(`university:${id}`);
    await this.redis.deletePattern('universities:list:*');

    return result;
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
    const key = url.pathname.startsWith('/')
      ? url.pathname.slice(1)
      : url.pathname;
    const signedUrl = await this.storage.getSignedUrl(key, 900); // 15 min
    return { url: signedUrl, expiresIn: 900 };
  }

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
