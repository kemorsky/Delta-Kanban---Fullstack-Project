export type Todo = {
    id?: string | undefined;
    columnId: string;
    title?: string;
    description?: string;
    order?: number;
};

export type Column = {
    id: string,
    title: string,
    order?: number;
};