import { saveSurveyAnswers } from "@/lib/answers";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const formData = await request.formData();

  await saveSurveyAnswers(formData);

  revalidatePath("/results");

  return Response.redirect(new URL("/?submitted=1", request.url), 303);
}
