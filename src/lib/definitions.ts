type nullable<T> = T | null;

export type DateIdeaStatus = 'idea' | 'planned' | 'completed';

export const DATE_IDEA_CATEGORIES = ['Cozy In', 'Foodie', 'Outdoor', 'Creative', 'Adventure', 'Errands Plus'] as const;
export const DATE_IDEA_BUDGETS = ['Free', '$', '$$', '$$$'] as const;

export type Journal = {
    id: number;
    uuid: string;
    title: nullable<string>;
    shared_with: string[];
    shared_with_names: {id: string, name: string, email: string}[];
    creator_name: string;
}

export type Entry = {
    id: number;
    journal_id: number;
    title: nullable<string>;
    content: nullable<string>;
    created_date: Date;
    last_modified: Date;
    creator: string;
}

export type DateIdea = {
    id: number;
    journal_id: number;
    title: string;
    description: nullable<string>;
    category: string;
    budget: string;
    added_by: string;
    added_by_name: string;
    created_at: Date;
    status: DateIdeaStatus;
    planned_at: nullable<Date>;
    completed_at: nullable<Date>;
    completed_note: nullable<string>;
}

export type DateIdeaSummary = {
    idea: number;
    planned: number;
    completed: number;
    plannedIdea: nullable<DateIdea>;
}
