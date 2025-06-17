export type Todo = {
    id: string;
    title: string;
    description: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
};

export type Id = {
    id: string | number
}

export type Column = {
    id: Id,
    title: string;
};