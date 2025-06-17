export type Id = {
    id: string | number
}

export type Todo = {
    id?: string;
    columnId?: Id;
    title: string;
    description: string;
};

export type Column = {
    id: Id,
    title: string;
};