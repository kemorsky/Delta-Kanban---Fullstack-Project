export type Todo = {
    id?: string;
    columnId: string;
    title?: string;
    description?: string;
};

export type Column = {
    id: string,
    title: string;
    todoIds?: string[]
};