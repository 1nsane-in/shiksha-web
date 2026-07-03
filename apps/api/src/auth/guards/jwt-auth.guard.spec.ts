import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: { verifyAsync: jest.Mock };
  let reflector: { getAllAndOverride: jest.Mock };
  let configService: { get: jest.Mock };

  const mockRequest = (token?: string) => {
    const req: Record<string, any> = {
      headers: {},
    };
    if (token) {
      req.headers = { authorization: `Bearer ${token}` };
    }
    return req;
  };

  const mockContext = (request: Record<string, any>): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    }) as unknown as ExecutionContext;

  beforeEach(async () => {
    jwtService = { verifyAsync: jest.fn() };
    reflector = { getAllAndOverride: jest.fn() };
    configService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: jwtService },
        { provide: Reflector, useValue: reflector },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    guard = module.get(JwtAuthGuard);
  });

  it('allows public endpoints without token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const req = mockRequest();
    const ctx = mockContext(req);
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('throws UnauthorizedException when no token on protected route', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const req = mockRequest();
    const ctx = mockContext(req);
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when token is invalid', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));
    configService.get.mockReturnValue('secret');
    const req = mockRequest('bad-token');
    const ctx = mockContext(req);
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('sets user on request when token is valid', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const payload = { id: 'user-1', email: 'test@example.com' };
    jwtService.verifyAsync.mockResolvedValue(payload);
    configService.get.mockReturnValue('secret');
    const req = mockRequest('valid-token');
    const ctx = mockContext(req);
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect((req as any).user).toEqual(payload);
  });

  it('throws UnauthorizedException when JWT_SECRET is not configured', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    configService.get.mockReturnValue(undefined);
    const req = mockRequest('any-token');
    const ctx = mockContext(req);
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
