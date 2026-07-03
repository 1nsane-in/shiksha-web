import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockContext = (user?: any, handler = () => {}) =>
    ({
      getHandler: () => handler,
      getClass: () => class {},
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as any;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const result = guard.canActivate(mockContext({ role: 'STUDENT' }));

    expect(result).toBe(true);
  });

  it('should deny access when user is not present on request', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const result = guard.canActivate(mockContext(undefined));

    expect(result).toBe(false);
  });

  it('should allow access when user has required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const result = guard.canActivate(mockContext({ role: 'ADMIN' }));

    expect(result).toBe(true);
  });

  it('should allow access for SUPER_ADMIN on ADMIN-only routes', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const result = guard.canActivate(mockContext({ role: 'SUPER_ADMIN' }));

    expect(result).toBe(false);
  });

  it('should allow access when user has one of multiple required roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['ADMIN', 'SUPER_ADMIN']);

    const result1 = guard.canActivate(mockContext({ role: 'ADMIN' }));
    const result2 = guard.canActivate(mockContext({ role: 'SUPER_ADMIN' }));

    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it('should deny access when user role does not match', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const result = guard.canActivate(mockContext({ role: 'STUDENT' }));

    expect(result).toBe(false);
  });

  it('should retrieve roles from both handler and class metadata', () => {
    const handler = () => {};
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['SUPER_ADMIN']);

    const result = guard.canActivate(mockContext({ role: 'SUPER_ADMIN' }, handler));

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      handler,
      expect.any(Function),
    ]);
  });
});
