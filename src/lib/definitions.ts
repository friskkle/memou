type nullable<T> = T | null;

export type DateIdeaStatus = 'idea' | 'planned' | 'completed';

export const DATE_IDEA_CATEGORIES = ['Cozy In', 'Foodie', 'Outdoor', 'Creative', 'Adventure', 'Errands Plus'] as const;
export const DATE_IDEA_BUDGETS = ['Free', '$', '$$', '$$$'] as const;
export const DATE_IDEA_PRIORITIES = {1: 'Low', 2: 'Medium', 3: "High"} as const;

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
    priority: number;
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

type MarkType = "bold" | "italic" | "underline" | "strike" | "code" | "link";

interface Mark {
  type: MarkType;
  attrs?: Record<string, unknown>;
}

type NodeType =
  | "doc"
  | "paragraph"
  | "text"
  | "hardBreak"
  | "blockquote"
  | "heading"
  | "bulletList"
  | "orderedList"
  | "listItem"
  | "codeBlock"
  | "horizontalRule"
  | "image";

export interface DocNode {
  type: NodeType;
  text?: string;        // only on "text" nodes
  marks?: Mark[];       // only on "text" nodes
  attrs?: Record<string, unknown>;  // e.g. heading level, image src
  content?: DocNode[];  // absent on leaf nodes (text, hardBreak, etc.)
}