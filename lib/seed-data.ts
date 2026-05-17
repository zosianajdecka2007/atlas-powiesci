import type { BookProject, StoryEdge, StoryNode } from "@/lib/types";

const now = new Date().toISOString();

export const seedProject: BookProject = {
  id: "2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842",
  title: "Tam, gdzie rozsądek przegrał z nami",
  subtitle: "Mapa trylogii, relacji i emocjonalnych punktów zwrotnych",
  createdAt: now,
  updatedAt: now
};

export const seedNodes: StoryNode[] = [
  {
    id: "root",
    type: "storyNode",
    position: { x: 0, y: 0 },
    data: {
      title: "Tam, gdzie rozsądek przegrał z nami",
      type: "Fabuła",
      description: "Centralny projekt książki / trylogii.",
      notes: "Główny hub dla tomów, postaci, relacji, lokacji i osi czasu.",
      tags: ["trylogia", "romans", "drama"],
      color: "#263247",
      icon: "book",
      createdAt: now,
      updatedAt: now,
      details: { summary: "Historia o napięciu, wyborach i tym, co zostaje po przekroczeniu granicy rozsądku." }
    }
  },
  {
    id: "leah",
    type: "storyNode",
    position: { x: -430, y: -190 },
    data: {
      title: "Leah Carter",
      type: "Postać",
      description: "Bohaterka balansująca między kontrolą a pragnieniem wolności.",
      notes: "",
      tags: ["protagonistka", "sekret"],
      color: "#8f3147",
      icon: "user",
      createdAt: now,
      updatedAt: now,
      details: {
        firstName: "Leah",
        lastName: "Carter",
        age: 22,
        personality: "Inteligentna, obserwująca, ostrożna. Ukrywa emocje pod perfekcyjną organizacją.",
        desires: "Chce odzyskać kontrolę nad własnym życiem.",
        secrets: "Nie mówi całej prawdy o tym, dlaczego wróciła nad jezioro.",
        symbolColor: "bordo",
        symbolMusic: "cicha gitara, nocne playlisty"
      }
    }
  },
  {
    id: "leo",
    type: "storyNode",
    position: { x: 420, y: -180 },
    data: {
      title: "Leonardo Moretti",
      type: "Postać",
      description: "Postać magnetyczna, spokojna na zewnątrz, niebezpiecznie pamiętliwa.",
      notes: "",
      tags: ["love interest", "tajemnica"],
      color: "#263247",
      icon: "user",
      createdAt: now,
      updatedAt: now,
      details: {
        firstName: "Leonardo",
        lastName: "Moretti",
        nicknames: ["Leo"],
        personality: "Opanowany, lojalny, intensywny. Trzyma ludzi na dystans, dopóki nie uzna ich za swoich.",
        fears: "Utrata kontroli i powtórzenie błędów rodziny.",
        attachmentStyle: "unikowo-lękowy",
        symbolPlace: "dom nad jeziorem"
      }
    }
  },
  {
    id: "mia",
    type: "storyNode",
    position: { x: -430, y: 110 },
    data: {
      title: "Mia Anderson",
      type: "Postać",
      description: "Najbliższa przyjaciółka, która widzi więcej, niż mówi.",
      notes: "",
      tags: ["przyjaźń", "wsparcie"],
      color: "#6f7f72",
      icon: "user",
      createdAt: now,
      updatedAt: now,
      details: { firstName: "Mia", lastName: "Anderson", personality: "Ciepła, ironiczna, bardzo lojalna." }
    }
  },
  {
    id: "nate",
    type: "storyNode",
    position: { x: 425, y: 120 },
    data: {
      title: "Nate Reed",
      type: "Postać",
      description: "Dawny znajomy, potencjalny katalizator konfliktu.",
      notes: "",
      tags: ["konflikt", "przeszłość"],
      color: "#b58145",
      icon: "user",
      createdAt: now,
      updatedAt: now,
      details: { firstName: "Nate", lastName: "Reed", biggestConflict: "Wie o decyzji Leah, której Leo nigdy jej nie wybaczył." }
    }
  },
  {
    id: "relationship-leah-leo",
    type: "storyNode",
    position: { x: 0, y: -330 },
    data: {
      title: "Relacja Leah & Leo",
      type: "Relacja",
      description: "Relacja oparta na chemii, niedopowiedzeniach i wzajemnym testowaniu granic.",
      notes: "",
      tags: ["romans", "napięcie"],
      color: "#8f3147",
      icon: "heart",
      createdAt: now,
      updatedAt: now,
      details: {
        relationType: "romantyczna / konfliktowa",
        dynamic: "Powolne przyciąganie, dużo ciszy, spojrzeń i starych ran.",
        trustLevel: 4,
        tensionLevel: 9,
        obsessionLevel: 7,
        jealousyLevel: 6,
        biggestConflict: "Czy ich uczucie jest prawdziwe, czy tylko reakcją na wspólną traumę?"
      }
    }
  },
  {
    id: "volume-one",
    type: "storyNode",
    position: { x: 0, y: 300 },
    data: {
      title: "Tom 1",
      type: "Rozdział",
      description: "Pierwszy tom jako główna gałąź fabularna.",
      notes: "",
      tags: ["tom", "początek"],
      color: "#263247",
      icon: "book",
      createdAt: now,
      updatedAt: now,
      details: {
        chapterNumber: 1,
        chapterTitle: "Powrót nad jezioro",
        pov: "Leah",
        place: "Dom nad jeziorem",
        chapterGoal: "Ustawić napięcie między przeszłością a teraźniejszością.",
        cliffhanger: "Leah znajduje rzecz, która nie powinna istnieć."
      }
    }
  },
  {
    id: "lake-house",
    type: "storyNode",
    position: { x: -40, y: 560 },
    data: {
      title: "Dom nad jeziorem",
      type: "Lokacja",
      description: "Miejsce wspomnień, sekretów i powracających decyzji.",
      notes: "",
      tags: ["lokacja", "symbol"],
      color: "#315a70",
      icon: "home",
      createdAt: now,
      updatedAt: now,
      details: {
        summary: "Stary dom z werandą, zapachem deszczu i pokojami, które pamiętają więcej niż bohaterowie.",
        purpose: "Przestrzeń konfrontacji i powrotu do niedomkniętych spraw."
      }
    }
  }
];

export const seedEdges: StoryEdge[] = [
  { id: "root-leah", source: "root", target: "leah", animated: true },
  { id: "root-leo", source: "root", target: "leo", animated: true },
  { id: "root-mia", source: "root", target: "mia" },
  { id: "root-nate", source: "root", target: "nate" },
  { id: "root-relation", source: "root", target: "relationship-leah-leo", animated: true },
  { id: "leah-relation", source: "leah", target: "relationship-leah-leo" },
  { id: "leo-relation", source: "leo", target: "relationship-leah-leo" },
  { id: "root-volume-one", source: "root", target: "volume-one" },
  { id: "volume-one-lake-house", source: "volume-one", target: "lake-house" }
];
