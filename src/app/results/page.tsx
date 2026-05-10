import { getSurveyResults } from "@/lib/answers";
import { adminLoginAction, adminLogoutAction } from "@/app/admin/actions";
import { getAdminPassword, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const passwordConfigured = Boolean(getAdminPassword());
  const authorized = await isAdmin();

  if (!passwordConfigured) {
    return (
      <main className="flex-1 bg-background text-on-background">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <section className="border-4 border-primary p-6 bg-surface-container-lowest shadow-[6px_6px_0px_#1a1a1a]">
            <h1 className="font-headline font-black text-3xl md:text-4xl uppercase tracking-tight mb-4">
              Mot de passe admin manquant
            </h1>
            <p className="font-body text-lg text-on-surface-variant">
              Definissez ADMIN_PASSWORD dans le fichier .env pour activer l'acces aux resultats.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex-1 bg-background text-on-background">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <section className="border-4 border-primary p-6 bg-surface-container-lowest shadow-[6px_6px_0px_#1a1a1a]">
            <h1 className="font-headline font-black text-3xl md:text-4xl uppercase tracking-tight mb-4">
              Acces aux resultats
            </h1>
            <form action={adminLoginAction} className="flex flex-col gap-4">
              <input type="hidden" name="redirectTo" value="/results" />
              <label className="font-headline font-bold text-xl text-primary">
                Mot de passe
              </label>
              <input
                className="bg-background border-4 border-primary p-4 font-body text-lg"
                type="password"
                name="password"
                placeholder="Entrez le mot de passe"
                required
              />
              <button
                className="w-full md:w-auto font-headline font-black text-2xl uppercase tracking-tighter bg-primary-container text-primary border-4 border-primary px-10 py-4 hover:bg-primary hover:text-primary-container active:translate-y-1 transition-all duration-75 shadow-[6px_6px_0px_#1a1a1a] hover:shadow-[2px_2px_0px_#1a1a1a] translate-y-[-6px] hover:translate-y-[-2px]"
                type="submit"
              >
                Entrer
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

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
          <form action={adminLogoutAction} className="mt-6">
            <input type="hidden" name="redirectTo" value="/" />
            <button
              className="font-headline font-black text-base uppercase tracking-tighter bg-secondary text-on-secondary border-4 border-primary px-6 py-2 hover:bg-primary hover:text-primary-container active:translate-y-1 transition-all duration-75 shadow-[4px_4px_0px_#1a1a1a] hover:shadow-[2px_2px_0px_#1a1a1a] translate-y-[-4px] hover:translate-y-[-2px]"
              type="submit"
            >
              Deconnexion
            </button>
          </form>
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
