export type Todo = {
    id?: string | undefined;
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