export type UserCredentials = {
    username: string;
    password: string;
};

export type User = {
    id?: string;
    username?: string;
    role?: string;
    createdAt?: string;
};

export type Label = {
    labelId?: string;
    title: string
}

export type Todo = {
    id?: string | undefined;
    user?: User,
    columnId: string;
    title?: string;
    description?: string;
    labels?: Label[];
    order?: number;
    createdAt?: string;
    updatedAt?: string;
    done?: boolean;
};

export type Column = {
    id: string,
    title: string,
    order?: number;
};