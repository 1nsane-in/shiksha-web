import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuditLogService } from '../services/audit-log.service';

interface AuditableOptions {
  entityType: string;
  entityIdParam?: string;
  getEntityId?: (data: any) => string | undefined;
}

  export function Auditable(options: AuditableOptions) {
  @Injectable()
  class AuditInterceptor implements NestInterceptor {
    constructor(public readonly auditLogService: AuditLogService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const userId = request.user?.id;

      return next.handle().pipe(
        map((data) => {
          let entityId: string | undefined;

          if (options.entityIdParam) {
            entityId = request.params[options.entityIdParam];
          } else if (options.getEntityId) {
            entityId = options.getEntityId(data);
          } else if (data?.id) {
            entityId = data.id;
          }

          if (entityId && userId) {
            this.auditLogService.log({
              userId,
              action: context.getHandler().name,
              entityType: options.entityType,
              entityId,
              ipAddress: request.ip,
              userAgent: request.headers['user-agent'],
            });
          }

          return data;
        }),
      );
    }
  }

  return AuditInterceptor;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const userId = request.user?.id;

    return next.handle().pipe(
      tap((data) => {
        if (!userId || !data) return;

        const auditPoints = Reflect.getMetadata('audit_point', handler) || {};

        if (auditPoints.entityType && auditPoints.entityId) {
          this.auditLogService.log({
            userId,
            action: handler.name,
            entityType: auditPoints.entityType,
            entityId: auditPoints.entityId,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        }
      }),
    );
  }
}

export function AuditPoint(entityType: string, entityIdParam: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('audit_point', { entityType, entityIdParam }, descriptor.value);
    return descriptor;
  };
}
