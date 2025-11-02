// type nullable<T> = T | null;

export type Journal = {
    id: number;
    uuid: string;
    title: string;
    shared_with: string[];
}

export type Entry = {
    id: number;
    journal_id: number;
    title: string;
    content: string;
    created_date: Date;
    last_modified: Date;
}