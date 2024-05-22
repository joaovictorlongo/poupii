import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}
  create(userId: string, createTransactionInput: CreateTransactionInput) {
    return this.prismaService.transaction.create({
      data: {
        amount: createTransactionInput.amount,
        description: createTransactionInput.description,
        type: createTransactionInput.type,
        transactionDate: createTransactionInput.transactionDate,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prismaService.transaction.findMany({
      include: {
        user: true,
      },
      where: {
        userId: userId,
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.transaction.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateTransactionInput: UpdateTransactionInput) {
    return this.prismaService.transaction.update({
      where: {
        id,
      },
      data: {
        amount: updateTransactionInput.amount,
        description: updateTransactionInput.description,
        type: updateTransactionInput.type,
        transactionDate: updateTransactionInput.transactionDate,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.transaction.delete({
      where: {
        id,
      },
    });
  }
}
