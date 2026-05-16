import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  CreateAdminDto,
  GoogleAuthDto,
  GoogleRegisterDto,
} from "./auth.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    // TODO: Implement OTP sending with email service (ZeptoMail/Twilio)
    return { message: "OTP sent to your email" };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    // TODO: Implement OTP verification
    return { message: "OTP verified successfully" };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
        emailVerified: true,
        role: "STUDENT",
      },
    });

    await this.prisma.student.create({
      data: {
        userId: newUser.id,
      },
    });

    const token = this.generateToken(newUser);

    return { message: "Registration successful", user: newUser, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.generateToken(user);

    return {
      message: "Login successful",
      user,
      token,
    };
  }

  async googleLogin(dto: GoogleAuthDto) {
    this.logger.log(`Google login attempt with token: ${dto.accessToken?.substring(0, 20)}...`);
    
    // Verify Google token
    const userInfo = await this.verifyGoogleToken(dto.accessToken);
    this.logger.debug(`Google token verification result: ${JSON.stringify(userInfo)}`);

    if (!userInfo) {
      this.logger.warn('Invalid Google token');
      throw new UnauthorizedException("Invalid Google token");
    }

    this.logger.log(`Google user info: ${userInfo.email}, ${userInfo.name}`);

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      this.logger.log(`User not found, auto-registering: ${userInfo.email}`);
      // Auto-register the user
      user = await this.prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name || userInfo.email.split('@')[0],
          emailVerified: true,
          role: "STUDENT",
          isActive: true,
        },
      });

      await this.prisma.student.create({
        data: {
          userId: user.id,
        },
      });

      this.logger.log(`Auto-registered user: ${user.id}`);
    }

    const token = this.generateToken(user);
    this.logger.log(`Login successful for user: ${user.id}`);

    return {
      message: "Google login successful",
      user,
      token,
    };
  }

  async googleRegister(dto: GoogleRegisterDto) {
    this.logger.log(`Google register attempt for: ${dto.email}`);
    
    const existingEmailUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingEmailUser) {
      this.logger.warn(`User already exists: ${dto.email}`);
      throw new BadRequestException("User already registered with this email");
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        emailVerified: true,
        role: "STUDENT",
        isActive: true,
      },
    });

    await this.prisma.student.create({
      data: {
        userId: newUser.id,
      },
    });

    const token = this.generateToken(newUser);
    this.logger.log(`Registration successful for user: ${newUser.id}`);

    return {
      message: "Google registration successful",
      user: newUser,
      token,
    };
  }

  async logout(token: string) {
    // TODO: Add token to blacklist if needed
    return { message: "Logged out successfully" };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }

  async createAdmin(dto: CreateAdminDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
        role: "ADMIN",
        emailVerified: true,
        isActive: true,
      },
    });

    return { message: "Admin created successfully", user };
  }

  async forgotPassword(email: string) {
    // TODO: Implement password reset email
    return { message: "Password reset email sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    // TODO: Implement password reset with token verification
    return { message: "Password reset successful" };
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private async verifyGoogleToken(token: string): Promise<any> {
    try {
      this.logger.debug(`Verifying Google token...`);
      
      let accessToken = token;
      
      // If it's an authorization code (starts with 4/), exchange it for tokens
      if (token.startsWith('4/') || token.startsWith('1/')) {
        this.logger.debug('Token is an authorization code, exchanging for access token...');
        
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code: token,
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            redirect_uri: 'http://localhost:3000/auth/callback',
            grant_type: 'authorization_code',
          }),
        });
        
        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          this.logger.error(`Token exchange failed: ${JSON.stringify(errorData)}`);
          return null;
        }
        
        const tokenData = await tokenResponse.json();
        this.logger.debug(`Token exchange successful`);
        accessToken = tokenData.access_token;
        
        // If we got an ID token, use it for better user info
        if (tokenData.id_token) {
          this.logger.debug('ID token received, decoding...');
          const idTokenPayload = JSON.parse(Buffer.from(tokenData.id_token.split('.')[1], 'base64').toString());
          return {
            sub: idTokenPayload.sub,
            email: idTokenPayload.email,
            name: idTokenPayload.name,
            picture: idTokenPayload.picture,
            email_verified: idTokenPayload.email_verified,
          };
        }
      }
      
      // Check if it's an ID token (JWT format)
      const isIdToken = accessToken.split('.').length === 3;
      
      if (isIdToken) {
        // ID token - verify with Google's tokeninfo endpoint
        this.logger.debug('Token appears to be an ID token, verifying...');
        const response = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`
        );
        
        if (!response.ok) {
          this.logger.warn(`ID token verification failed: ${response.status}`);
          return null;
        }
        
        const tokenInfo = await response.json();
        this.logger.debug(`Token info: ${JSON.stringify(tokenInfo)}`);
        
        // Verify the audience matches our client ID
        const expectedAudience = process.env.GOOGLE_CLIENT_ID;
        if (tokenInfo.aud !== expectedAudience) {
          this.logger.warn(`Token audience mismatch: ${tokenInfo.aud} !== ${expectedAudience}`);
          return null;
        }
        
        return {
          sub: tokenInfo.sub,
          email: tokenInfo.email,
          name: tokenInfo.name,
          picture: tokenInfo.picture,
          email_verified: tokenInfo.email_verified,
        };
      } else {
        // Access token - get user info
        this.logger.debug('Token appears to be an access token, fetching user info...');
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          this.logger.warn(`Access token verification failed: ${response.status}`);
          return null;
        }

        const userInfo = await response.json();
        this.logger.debug(`User info: ${JSON.stringify(userInfo)}`);
        return userInfo;
      }
    } catch (error) {
      this.logger.error(`Google token verification error: ${error.message}`);
      return null;
    }
  }
}
