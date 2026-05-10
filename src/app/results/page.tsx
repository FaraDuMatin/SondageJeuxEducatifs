import { getSurveyResults } from "@/lib/answers";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const results = await getSurveyResults();

  return (
    <main className="flex-1 bg-background text-on-background">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <section className="border-b-4 border-primary pb-8 mb-12">
          <h1 className="font-headline font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-4">
            Resultats du sondage
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl">
            Vue d'ensemble des reponses recueillies.
          </p>
        </section>

        <section className="flex flex-col gap-8">
          {results.length === 0 ? (
            <div className="border-4 border-primary p-6 bg-surface-container-lowest">
              <p className="font-body text-lg">
                Aucune reponse pour le moment.
              </p>
            </div>
          ) : null}

          {results.map((result) => {
            const { question, total } = result;

            return (
              <div
                key={question.id}
                className="border-4 border-primary p-6 bg-surface-container-lowest shadow-[6px_6px_0px_#1a1a1a]"
              >
                <div className="flex flex-col gap-2 mb-6">
                  <h2 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tight">
                    {question.prompt}
                  </h2>
                  <p className="font-body text-sm text-on-surface-variant">
                    Total reponses: {total}
                  </p>
                </div>

                {question.type === "multiple" ? (
                  <div className="flex flex-col gap-4">
                    {result.options.map((optionResult) => {
                      const percent =
                        total > 0
                          ? Math.round((optionResult.count / total) * 100)
                          : 0;

                      return (
                        <div
                          key={optionResult.option.id}
                          className="border-4 border-primary p-4 bg-background"
                        >
                          <div className="flex items-center justify-between font-body text-lg">
                            <span>{optionResult.option.label}</span>
                            <span className="font-headline font-bold">
                              {optionResult.count}
                            </span>
                          </div>
                          <div className="mt-3 h-4 border-4 border-primary bg-surface-container">
                            <div
                              className="h-full bg-primary-container"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {result.otherResponses.length > 0 ? (
                      <div className="border-4 border-primary p-4 bg-background">
                        <p className="font-headline font-bold text-lg mb-3">
                          Details Autre
                        </p>
                        <ul className="font-body text-base flex flex-col gap-2">
                          {result.otherResponses.map((response, index) => (
                            <li key={`${question.id}-other-${index}`}>
                              {response}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="border-4 border-primary p-4 bg-background">
                    {result.textResponses.length === 0 ? (
                      <p className="font-body text-lg">
                        Aucune reponse textuelle.
                      </p>
                    ) : (
                      <ul className="font-body text-lg flex flex-col gap-3">
                        {result.textResponses.map((response, index) => (
                          <li key={`${question.id}-text-${index}`}>{response}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
