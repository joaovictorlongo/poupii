import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { PrismaService } from 'src/services/prisma.service';
import { SelectTransactionInput } from './dto/select-transaction.input';

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
      include: { user: true },
    });
  }

  async findAll(
    userId: string,
    selectTransactionInput: SelectTransactionInput,
  ) {
    const transactionsSummary = await this.prismaService.transaction.groupBy({
      by: ['type'],
      _sum: {
        amount: true,
      },
      where: {
        userId: userId,
        AND: [
          {
            transactionDate: {
              gte: selectTransactionInput.from,
            },
          },
          {
            transactionDate: {
              lte: selectTransactionInput.to,
            },
          },
        ],
      },
    });
    const transactions = await this.prismaService.transaction.findMany({
      include: {
        user: true,
      },
      where: {
        userId: userId,
        AND: [
          {
            transactionDate: {
              gte: selectTransactionInput.from,
            },
          },
          {
            transactionDate: {
              lte: selectTransactionInput.to,
            },
          },
        ],
      },
      orderBy: [
        {
          transactionDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
    });
    let totalRevenue = 0;
    let totalExpense = 0;
    let totalBalance = 0;
    transactionsSummary.forEach((transaction) => {
      if (transaction.type === 'REVENUE') {
        totalRevenue = transaction._sum.amount;
      } else {
        totalExpense = transaction._sum.amount;
      }
    });
    totalBalance = totalRevenue - totalExpense;
    return {
      transactions,
      totalRevenue: totalRevenue || 0,
      totalExpense: totalExpense || 0,
      totalBalance: totalBalance || 0,
    };
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
      include: { user: true },
    });
  }

  remove(id: string) {
    return this.prismaService.transaction.delete({
      where: {
        id,
      },
      include: { user: true },
    });
  }
}
