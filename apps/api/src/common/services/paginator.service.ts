import { Injectable } from '@nestjs/common';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class PaginatorService {
  parseOptions(queryPage?: string, queryLimit?: string, defaultLimit = 10): PaginationOptions {
    const page = Math.max(1, parseInt(queryPage || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(queryLimit || String(defaultLimit))));
    return { page, limit };
  }

  getSkip(params: PaginationOptions): number {
    return (params.page - 1) * params.limit;
  }

  wrapResult<T>(data: T[], total: number, params: PaginationOptions): PaginatedResult<T> {
    return {
      data,
      meta: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }
}
