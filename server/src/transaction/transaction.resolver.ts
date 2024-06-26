import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { UserId } from 'src/decorators/user-id.decorator';
import { SelectTransactionInput } from './dto/select-transaction.input';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation('createTransaction')
  create(
    @UserId() userId: string,
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.create(userId, createTransactionInput);
  }

  @Query('transactions')
  findAll(
    @Args('selectTransactionInput')
    selectTransactionInput: SelectTransactionInput,
    @UserId() userId: string,
  ) {
    return this.transactionService.findAll(userId, selectTransactionInput);
  }

  @Query('transaction')
  findOne(@Args('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Mutation('updateTransaction')
  update(
    @Args('updateTransactionInput')
    updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.transactionService.update(
      updateTransactionInput.id,
      updateTransactionInput,
    );
  }

  @Mutation('removeTransaction')
  remove(@Args('id') id: string) {
    return this.transactionService.remove(id);
  }
}
