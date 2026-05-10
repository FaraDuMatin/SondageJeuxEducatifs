import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import { listQuestions } from "@/lib/questions";
import type { TextQuestion } from "@/types/questions";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: { submitted?: string };
};

function TextQuestionBlock({ question }: { question: TextQuestion }) {
  return (
    <div className="flex flex-col gap-4">
      <label
        className="font-headline font-bold text-2xl md:text-3xl leading-tight text-primary"
        htmlFor={question.id}
      >
        {question.prompt}
      </label>
      <textarea
        className="w-full bg-background border-4 border-primary p-4 font-body text-lg resize-y focus:border-secondary transition-colors"
        id={question.id}
        name={question.id}
        placeholder={question.placeholder}
        rows={question.rows ?? 3}
      />
    </div>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  const questions = await listQuestions();
  const showSubmitted = searchParams?.submitted === "1";

  return (
    <main className="flex-1 bg-background text-on-background">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <section className="bg-surface-container-lowest border-4 border-primary p-8 md:p-12 shadow-[8px_8px_0px_#1a1a1a]">
          <form action="/api/answers" method="post" className="flex flex-col gap-12">
            {showSubmitted ? (
              <div className="border-4 border-primary bg-primary-container text-primary p-4 font-headline font-bold uppercase tracking-tight">
                Merci. Reponse envoyee.
              </div>
            ) : null}

            {questions.length === 0 ? (
              <div className="border-4 border-primary p-6 bg-background">
                <p className="font-body text-lg">
                  Aucun sondage disponible pour le moment.
                </p>
              </div>
            ) : null}

            {questions.map((question, index) => (
              <div key={question.id} className="flex flex-col gap-4">
                {question.type === "text" ? (
                  <TextQuestionBlock question={question} />
                ) : (
                  <MultipleChoiceQuestion question={question} />
                )}
                {index < questions.length - 1 ? (
                  <hr className="border-t-4 border-primary opacity-20" />
                ) : null}
              </div>
            ))}

            {questions.length > 0 ? (
              <div className="pt-8 border-t-4 border-primary">
                <button
                  className="w-full md:w-auto font-headline font-black text-3xl uppercase tracking-tighter bg-primary-container text-primary border-4 border-primary px-12 py-6 hover:bg-primary hover:text-primary-container active:translate-y-2 transition-all duration-75 shadow-[8px_8px_0px_#1a1a1a] hover:shadow-[2px_2px_0px_#1a1a1a] translate-y-[-8px] hover:translate-y-[-2px] flex items-center justify-center gap-4 group"
                  type="submit"
                >
                  ENVOYER LES REPONSES
                  <span className="text-4xl group-hover:translate-x-2 transition-transform">
                    -&gt;
                  </span>
                </button>
              </div>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
