export type Transactions = {
  totalRevenue: number;
  totalExpense: number;
  totalBalance: number;
  transactions: {
    id: string;
    amount: number;
    description: string;
    type: string;
    transactionDate: string;
    userId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    }
  }[]
}
