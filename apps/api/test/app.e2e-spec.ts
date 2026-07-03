import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('/health (GET) returns health check result', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('info');
          expect(res.body.info).toHaveProperty('database');
          expect(res.body.info).toHaveProperty('redis');
        });
    });
  });

  describe('Auth', () => {
    const testEmail = `test-${Date.now()}@example.com`;

    it('POST /auth/register - sends OTP', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: testEmail, name: 'Test User' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });

    it('POST /auth/login - validates credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: 'wrong-password' })
        .expect(401);
    });

    it('POST /auth/refresh - requires refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });
});
