"use server";

import { prisma } from "../prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export async function createEntry(journal_id: number, title: string) {
  console.log("Creating a new entry");
  let returning_id = 0;
  try {
    const entry = await prisma.journal_entries.create({
      data: {
        journal_id,
        title,
        content: "",
        created_date: new Date(),
        last_modified: new Date(),
      },
    });
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
    await prisma.journal_entries.update({
      where: {
        id: entry_id,
      },
      data: {
        title,
        content,
        last_modified: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
}

export async function deleteEntry(entry_id: number): Promise<void> {
  try {
    console.log("Deleting entry with ID:", entry_id);
    const deletedEntry = await prisma.journal_entries.delete({
      where: {
        id: entry_id,
      },
      select: {
        journal_id: true,
      },
    });
    const returning_id = deletedEntry.journal_id;
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
    const journal = await prisma.journals.create({
      data: {
        uuid,
        title,
        shared_with: [],
      },
    });
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
    const deletedJournal = await prisma.journals.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    const returning_id = deletedJournal.id;
    console.log("Deleted journal with ID:", returning_id);
    revalidatePath(`/journal`);
  } catch (error) {
    console.error("Error deleting journal:", error);
    throw error;
  }
}
