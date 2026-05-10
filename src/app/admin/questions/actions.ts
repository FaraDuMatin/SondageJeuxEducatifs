"use server";

import { revalidatePath } from "next/cache";
import { createQuestion, deleteQuestion, updateQuestion } from "@/lib/questions";
import type { MultipleChoiceOption } from "@/types/questions";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

function parseOptions(raw: string, includeOther: boolean): MultipleChoiceOption[] {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const options = lines.map((line) => {
    const [labelPart, valuePart] = line.split("|");
    const label = labelPart.trim();
    const value = valuePart?.trim() || slugify(label) || crypto.randomUUID();

    return {
      id: value,
      label,
      value,
    };
  });

  if (includeOther) {
    options.push({
      id: "other",
      label: "Autre",
      value: "other",
      isOther: true,
    });
  }

  return options;
}

export async function createQuestionAction(formData: FormData) {
  const prompt = String(formData.get("prompt") ?? "").trim();
  const type = String(formData.get("type") ?? "text");
  const optionsRaw = String(formData.get("options") ?? "");
  const includeOther = formData.get("includeOther") === "on";

  if (!prompt || (type !== "text" && type !== "multiple")) {
    return;
  }

  const options =
    type === "multiple" ? parseOptions(optionsRaw, includeOther) : undefined;

  await createQuestion({
    id: crypto.randomUUID(),
    type,
    prompt,
    options,
  });

  revalidatePath("/admin/questions");
  revalidatePath("/");
  revalidatePath("/results");
}

export async function updateQuestionAction(formData: FormData) {
  const questionId = String(formData.get("questionId") ?? "").trim();
  const prompt = String(formData.get("prompt") ?? "").trim();
  const type = String(formData.get("type") ?? "text");
  const optionsRaw = String(formData.get("options") ?? "");
  const includeOther = formData.get("includeOther") === "on";

  if (!questionId || !prompt || (type !== "text" && type !== "multiple")) {
    return;
  }

  const options =
    type === "multiple" ? parseOptions(optionsRaw, includeOther) : undefined;

  await updateQuestion({
    id: questionId,
    type,
    prompt,
    options,
  });

  revalidatePath("/admin/questions");
  revalidatePath("/");
  revalidatePath("/results");
}

export async function deleteQuestionAction(formData: FormData) {
  const questionId = String(formData.get("questionId") ?? "").trim();
  if (!questionId) {
    return;
  }

  await deleteQuestion(questionId);

  revalidatePath("/admin/questions");
  revalidatePath("/");
  revalidatePath("/results");
}
