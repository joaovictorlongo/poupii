
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateTransactionInput {
    amount: number;
    description: string;
    type: string;
    transactionDate: string;
}

export interface UpdateTransactionInput {
    id: string;
    amount: number;
    description: string;
    type: string;
    transactionDate: string;
}

export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdateUserInput {
    id: string;
}

export interface LoginUserInput {
    email: string;
    password: string;
}

export interface Transaction {
    id: string;
    amount: number;
    description?: Nullable<string>;
    type: string;
    transactionDate: string;
    userId: string;
    user: User;
    createdAt: string;
    updatedAt?: Nullable<string>;
}

export interface IQuery {
    transactions(): Nullable<Nullable<Transaction>[]> | Promise<Nullable<Nullable<Transaction>[]>>;
    transaction(id: string): Nullable<Transaction> | Promise<Nullable<Transaction>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    createTransaction(createTransactionInput: CreateTransactionInput): Transaction | Promise<Transaction>;
    updateTransaction(updateTransactionInput: UpdateTransactionInput): Transaction | Promise<Transaction>;
    removeTransaction(id: string): Nullable<Transaction> | Promise<Nullable<Transaction>>;
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
    removeUser(id: string): Nullable<User> | Promise<Nullable<User>>;
    loginUser(loginUserInput: LoginUserInput): LoginUserToken | Promise<LoginUserToken>;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt?: Nullable<string>;
}

export interface LoginUserToken {
    token: string;
}

type Nullable<T> = T | null;
