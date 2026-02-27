"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createNewEntry, createNewJournal } from "../journals";
import { auth } from "../auth";
import { headers } from "next/headers";

export type State = {
  message?: string | null;
  errors?: {
    title?: string[];
  };
};

const FormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  uuid: z.string(),
});

export async function createEntry(
  journal_id: number,
  title: string
): Promise<void> {
  console.log("Creating a new entry");
  let returning_id = 0;

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  
  try {
    const entry = await createNewEntry(journal_id, title, session.user.id);
    returning_id = entry.id;
    revalidatePath(`/journal/${journal_id}`);
  } catch (error) {
    console.error("Error creating entry:", error);
    throw error;
  } finally {
    redirect(`/journal/${journal_id}/${returning_id}`);
  }
}

export async function updateEntry(
  entry_id: number,
  title: string,
  content: string,
): Promise<void> {
  try {
    await updateEntry(entry_id, title, content);
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
}

export async function deleteEntry(entry_id: number): Promise<void> {
  try { // note to implement authentication here
    console.log("Deleting entry with ID:", entry_id)
    const returning_id = await deleteEntry(entry_id)

    console.log(
      "Deleted entry with ID:",
      entry_id,
      "from journal ID:",
      returning_id,
    );
    revalidatePath(`/journal/${returning_id}`);
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error;
  }
}

export async function createJournal(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    title: formData.get("title"),
    uuid: formData.get("uuid"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields, failed to create journal.",
    };
  }

  const { title, uuid } = validatedFields.data;
  let returning_id = 0;
  
  try {
    const journal = await createNewJournal(uuid, title);
    returning_id = journal.id;
    revalidatePath(`/journal`);
  } catch (error) {
    console.error("Error creating journal:", error);
    return {
      message: "Database error, failed to create journal.",
    };
  }
  redirect(`/journal/${returning_id}`);
}

export async function deleteJournal(id: number): Promise<void> {
  try {
    console.log("Deleting journal with ID:", id);
    const returning_id = await deleteJournal(id)

    console.log("Deleted journal with ID:", returning_id);
    revalidatePath(`/journal`);
  } catch (error) {
    console.error("Error deleting journal:", error);
    throw error;
  }
}
