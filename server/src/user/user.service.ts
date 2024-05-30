import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/services/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from './dto/login-user-input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(createUserInput: CreateUserInput) {
    createUserInput.password = await bcrypt.hash(createUserInput.password, 10);
    return this.prismaService.user.create({
      data: {
        ...createUserInput,
      },
    });
  }
  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserInput,
      },
    });
  }

  async remove(id: string) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async login(loginUserInput: LoginUserInput) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginUserInput.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      loginUserInput.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = this.jwtService.sign({
      userId: user.id,
    });
    return {
      token: token,
    };
  }

  async validateToken(token: string) {
    try {
      await this.jwtService.verify(token);
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
