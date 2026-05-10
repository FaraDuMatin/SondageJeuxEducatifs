import { listQuestions } from "@/lib/questions";
import {
  createQuestionAction,
  deleteQuestionAction,
  updateQuestionAction,
} from "@/app/admin/questions/actions";
import { adminLoginAction, adminLogoutAction } from "@/app/admin/actions";
import { getAdminPassword, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function formatOptions(options: Array<{ label: string; value: string; isOther?: boolean }>) {
  return options
    .filter((option) => !option.isOther)
    .map((option) => `${option.label}|${option.value}`)
    .join("\n");
}

export default async function QuestionsAdminPage() {
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
              Definissez ADMIN_PASSWORD dans le fichier .env pour activer l'acces admin.
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
              Acces admin
            </h1>
            <form action={adminLoginAction} className="flex flex-col gap-4">
              <input type="hidden" name="redirectTo" value="/admin/questions" />
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

  const questions = await listQuestions();

  return (
    <main className="flex-1 bg-background text-on-background">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <section className="border-b-4 border-primary pb-8 mb-12">
          <h1 className="font-headline font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-4">
            Gestion des questions
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl">
            Ajoutez, modifiez ou supprimez les questions du sondage.
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

        <section className="bg-surface-container-lowest border-4 border-primary p-6 md:p-8 shadow-[6px_6px_0px_#1a1a1a] mb-12">
          <h2 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tight mb-6">
            Ajouter une question
          </h2>
          <form action={createQuestionAction} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-headline font-bold text-xl text-primary">
                Type
              </label>
              <select
                className="bg-background border-4 border-primary p-3 font-body text-lg"
                name="type"
                defaultValue="text"
              >
                <option value="text">Reponse texte</option>
                <option value="multiple">Choix multiple</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-headline font-bold text-xl text-primary">
                Question
              </label>
              <textarea
                className="bg-background border-4 border-primary p-4 font-body text-lg"
                name="prompt"
                rows={3}
                placeholder="Ecrivez la question ici..."
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-headline font-bold text-xl text-primary">
                Options (choix multiple)
              </label>
              <textarea
                className="bg-background border-4 border-primary p-4 font-body text-lg"
                name="options"
                rows={4}
                placeholder="Une option par ligne. Format: Label|valeur"
              />
              <p className="font-body text-sm text-on-surface-variant">
                Le format "Label|valeur" est optionnel. Les options sont ignorees
                si le type est "Reponse texte".
              </p>
              <label className="flex items-center gap-3 font-body text-lg">
                <input
                  className="appearance-none w-6 h-6 border-4 border-primary bg-background checked:bg-secondary"
                  type="checkbox"
                  name="includeOther"
                />
                Ajouter une option Autre
              </label>
            </div>

            <button
              className="w-full md:w-auto font-headline font-black text-2xl uppercase tracking-tighter bg-primary-container text-primary border-4 border-primary px-10 py-4 hover:bg-primary hover:text-primary-container active:translate-y-1 transition-all duration-75 shadow-[6px_6px_0px_#1a1a1a] hover:shadow-[2px_2px_0px_#1a1a1a] translate-y-[-6px] hover:translate-y-[-2px]"
              type="submit"
            >
              Ajouter
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-8">
          {questions.length === 0 ? (
            <div className="border-4 border-primary p-6 bg-surface-container-lowest">
              <p className="font-body text-lg">
                Aucune question pour le moment.
              </p>
            </div>
          ) : null}

          {questions.map((question) => {
            const optionsValue =
              question.type === "multiple"
                ? formatOptions(question.options)
                : "";
            const includeOther =
              question.type === "multiple"
                ? question.options.some((option) => option.isOther)
                : false;

            return (
              <div
                key={question.id}
                className="border-4 border-primary p-6 bg-surface-container-lowest shadow-[6px_6px_0px_#1a1a1a]"
              >
                <form action={updateQuestionAction} className="flex flex-col gap-4">
                  <input type="hidden" name="questionId" value={question.id} />

                  <div className="flex flex-col gap-2">
                    <label className="font-headline font-bold text-xl text-primary">
                      Type
                    </label>
                    <select
                      className="bg-background border-4 border-primary p-3 font-body text-lg"
                      name="type"
                      defaultValue={question.type}
                    >
                      <option value="text">Reponse texte</option>
                      <option value="multiple">Choix multiple</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-headline font-bold text-xl text-primary">
                      Question
                    </label>
                    <textarea
                      className="bg-background border-4 border-primary p-4 font-body text-lg"
                      name="prompt"
                      rows={3}
                      defaultValue={question.prompt}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-headline font-bold text-xl text-primary">
                      Options (choix multiple)
                    </label>
                    <textarea
                      className="bg-background border-4 border-primary p-4 font-body text-lg"
                      name="options"
                      rows={4}
                      defaultValue={optionsValue}
                    />
                    <label className="flex items-center gap-3 font-body text-lg">
                      <input
                        className="appearance-none w-6 h-6 border-4 border-primary bg-background checked:bg-secondary"
                        type="checkbox"
                        name="includeOther"
                        defaultChecked={includeOther}
                      />
                      Ajouter une option Autre
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      className="font-headline font-black text-xl uppercase tracking-tighter bg-primary-container text-primary border-4 border-primary px-8 py-3 hover:bg-primary hover:text-primary-container active:translate-y-1 transition-all duration-75 shadow-[6px_6px_0px_#1a1a1a] hover:shadow-[2px_2px_0px_#1a1a1a] translate-y-[-6px] hover:translate-y-[-2px]"
                      type="submit"
                    >
                      Enregistrer
                    </button>
                    <button
                      className="font-headline font-black text-xl uppercase tracking-tighter bg-secondary text-on-secondary border-4 border-primary px-8 py-3 hover:bg-primary hover:text-primary-container active:translate-y-1 transition-all duration-75 shadow-[6px_6px_0px_#1a1a1a] hover:shadow-[2px_2px_0px_#1a1a1a] translate-y-[-6px] hover:translate-y-[-2px]"
                      type="submit"
                      formAction={deleteQuestionAction}
                    >
                      Supprimer
                    </button>
                  </div>
                </form>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
