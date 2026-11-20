import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CookieOriginGuard } from './cookie-origin.guard';

const guard = new CookieOriginGuard({
  get: jest.fn().mockReturnValue('https://app.example.com,https://admin.example.com'),
} as any);

function context(origin?: string) {
  const headers = origin ? { origin } : {};
  return {
    switchToHttp: () => ({ getRequest: () => ({ headers }) }),
  } as unknown as ExecutionContext;
}

describe('CookieOriginGuard', () => {
  it('allows configured origins', () => {
    expect(guard.canActivate(context('https://app.example.com'))).toBe(true);
    expect(guard.canActivate(context('https://admin.example.com/'))).toBe(true);
  });

  it('blocks foreign origins', () => {
    expect(() => guard.canActivate(context('https://evil.com'))).toThrow(
      ForbiddenException,
    );
  });

  it('allows non-browser clients with no Origin header', () => {
    expect(guard.canActivate(context())).toBe(true);
  });
});
