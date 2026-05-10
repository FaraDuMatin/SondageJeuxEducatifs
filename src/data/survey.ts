import type { Question } from "@/types/questions";

export const surveyQuestions: Question[] = [
  {
    id: "q1",
    type: "text",
    prompt:
      "Pensez vous que les jeux interactifs serait un bon moyen pour eduquer et s'amuser en meme temps de fortnite dance?",
    placeholder: "Votre reponse detaillee ici...",
    rows: 3,
  },
  {
    id: "q2",
    type: "text",
    prompt:
      "Quel est votre point de vue sur les jeux interactifs dans le milieu scolaire (ecole..)",
    placeholder: "Exprimez votre opinion...",
    rows: 4,
  },
  {
    id: "q3",
    type: "multiple",
    prompt: "Quel matiere ajouteriez vous dans un jeu interactif",
    otherPlaceholder: "Precisez votre reponse...",
    options: [
      { id: "math", label: "Mathematiques", value: "math" },
      { id: "sciences", label: "Sciences", value: "sciences" },
      { id: "anglais", label: "Anglais", value: "anglais" },
      { id: "musique", label: "Musique", value: "musique" },
      {
        id: "histoire_geo",
        label: "Histoire et geographie",
        value: "histoire_geo",
      },
      { id: "autre", label: "Autre", value: "other", isOther: true },
    ],
  },
];
