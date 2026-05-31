type PrismaQuery = Record<string, unknown>;

interface WhereCondition {
  field: string;
  value: unknown;
  operator?: 'equals' | 'contains' | 'in' | 'gte' | 'lte' | 'gt' | 'lt';
  nestedPath?: string;
  mode?: 'insensitive';
}

export class PrismaQueryBuilder {
  private conditions: WhereCondition[] = [];
  private searchFields: { field: string; value?: string }[] = [];

  where(field: string, value: unknown, operator?: WhereCondition['operator']): this {
    if (value !== undefined && value !== null && value !== '') {
      this.conditions.push({ field, value, operator });
    }
    return this;
  }

  whereNested(path: string, field: string, value: unknown): this {
    if (value !== undefined && value !== null && value !== '') {
      this.conditions.push({ field, value, nestedPath: path });
    }
    return this;
  }

  search(searchTerm: string | undefined, fields: string[]): this {
    if (searchTerm) {
      this.searchFields = fields.map((field) => ({ field, value: searchTerm }));
    }
    return this;
  }

  build(): PrismaQuery {
    const where: PrismaQuery = {};

    for (const condition of this.conditions) {
      if (condition.nestedPath) {
        const existing = (where[condition.nestedPath] as PrismaQuery) || {};
        where[condition.nestedPath] = {
          ...existing,
          [condition.field]: condition.value,
        };
      } else if (condition.operator === 'contains') {
        where[condition.field] = { contains: condition.value, mode: 'insensitive' };
      } else {
        where[condition.field] = condition.value;
      }
    }

    if (this.searchFields.length > 0) {
      where.OR = this.searchFields.map((sf) => ({
        [sf.field]: { contains: sf.value, mode: 'insensitive' },
      }));
    }

    return where;
  }
}

export function createQueryBuilder(): PrismaQueryBuilder {
  return new PrismaQueryBuilder();
}
