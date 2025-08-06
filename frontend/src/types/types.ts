export type UserCredentials = {
    username: string;
    password: string;
};

export type User = {
    id?: string,
    username?: string,
    role?: string,
};

export type Todo = {
    id?: string | undefined;
    user?: User,
    columnId: string;
    title?: string;
    description?: string;
    labels?: string[];
    order?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type Column = {
    id: string,
    title: string,
    order?: number;
};