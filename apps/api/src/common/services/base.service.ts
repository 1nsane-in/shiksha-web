import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type PrismaModel = {
  findUnique: (args: any) => Promise<any>;
  findFirst: (args: any) => Promise<any>;
};

export abstract class BaseService {
  constructor(protected readonly prisma: PrismaService) {}

  protected async findOrThrow<T>(
    model: PrismaModel,
    id: string,
    entityName: string,
    includes?: Record<string, unknown>,
  ): Promise<T> {
    const entity = await model.findUnique({
      where: { id },
      ...(includes ? { include: includes } : {}),
    });

    if (!entity) {
      throw new NotFoundException(`${entityName} not found`);
    }

    return entity as T;
  }

  protected async findFirstOrThrow<T>(
    model: PrismaModel,
    where: Record<string, unknown>,
    entityName: string,
  ): Promise<T> {
    const entity = await model.findFirst({ where });

    if (!entity) {
      throw new NotFoundException(`${entityName} not found`);
    }

    return entity as T;
  }

  protected async checkExists(
    model: PrismaModel,
    where: Record<string, unknown>,
    errorMessage: string,
  ): Promise<void> {
    const entity = await model.findFirst({ where });
    if (!entity) {
      throw new NotFoundException(errorMessage);
    }
  }

  protected async checkEmailExists(
    prisma: PrismaService,
    email: string,
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  }
}
