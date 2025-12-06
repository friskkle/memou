type nullable<T> = T | null;

export type Journal = {
    id: number;
    uuid: string;
    title: nullable<string>;
    shared_with: string[];
}

export type Entry = {
    id: number;
    journal_id: number;
    title: nullable<string>;
    content: nullable<string>;
    created_date: Date;
    last_modified: Date;
}