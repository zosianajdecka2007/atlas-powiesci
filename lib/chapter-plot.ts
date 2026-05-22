export type ChapterPlotInput = {
  title: string;
  premise: string;
  genre: string;
  tone: string;
  chaptersCount: number;
  pov: string;
  mainCharacters: string;
  coreConflict: string;
  romanticThread: string;
  secrets: string;
  endingDirection: string;
};

export type GeneratedChapter = {
  number: number;
  title: string;
  pov: string;
  place: string;
  goal: string;
  plotFunction: string;
  emotionalFunction: string;
  externalConflict: string;
  internalConflict: string;
  romanticTension: string;
  revealedSecret: string;
  openingScene: string;
  middleScene: string;
  endingScene: string;
  cliffhanger: string;
  readerFeeling: string;
  songOrVibe: string;
};

export type ChapterPlotOutput = {
  logline: string;
  actStructure: string[];
  chapters: GeneratedChapter[];
};

const actLabels = ["Otwarcie", "Komplikacja", "Punkt środkowy", "Kryzys", "Finał"];

export function generateFallbackChapterPlot(input: ChapterPlotInput): ChapterPlotOutput {
  const count = Math.max(3, Math.min(60, Number(input.chaptersCount) || 12));
  const title = input.title || "Nowy projekt";
  const premise = input.premise || "Bohaterowie zostają zmuszeni do konfrontacji z prawdą, której unikali.";
  const conflict = input.coreConflict || "zewnętrzna presja zderza się z prywatnym sekretem";
  const romance = input.romanticThread || "relacja rozwija się powoli, przez napięcie i niedopowiedzenia";
  const secrets = input.secrets || "ważna informacja wychodzi na jaw etapami";
  const ending = input.endingDirection || "finał zmienia układ sił i emocjonalną stawkę";

  const chapters = Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const progress = number / count;
    const actIndex = Math.min(actLabels.length - 1, Math.floor(progress * actLabels.length));
    const isOpening = number === 1;
    const isMid = number === Math.ceil(count / 2);
    const isFinal = number === count;
    const isCrisis = number === Math.max(2, count - 2);

    return {
      number,
      title: isOpening
        ? "Moment, od którego nie da się cofnąć"
        : isMid
          ? "Prawda pod powierzchnią"
          : isCrisis
            ? "To, co miało zostać ukryte"
            : isFinal
              ? "Cena ostatniej decyzji"
              : `${actLabels[actIndex]} ${number}`,
      pov: input.pov || "Najważniejsza postać sceny",
      place: "Miejsce o największym napięciu dla tego etapu historii",
      goal: isOpening
        ? `Wprowadzić świat, ton i główną ranę historii: ${premise}`
        : isFinal
          ? `Domknąć główny wybór emocjonalny i doprowadzić do finału: ${ending}`
          : `Przesunąć konflikt o jeden wyraźny krok: ${conflict}`,
      plotFunction: `${actLabels[actIndex]} aktu: rozdział ma zmienić informacje, układ sił albo kierunek decyzji.`,
      emotionalFunction: isMid
        ? "Złamać pozorne bezpieczeństwo i zmusić bohaterów do szczerości."
        : isCrisis
          ? "Doprowadzić emocje do pęknięcia, bez łatwego katharsis."
          : "Podnieść stawkę emocjonalną i zostawić czytelnika bliżej bohaterów.",
      externalConflict: conflict,
      internalConflict: "Bohater/bohaterka chce zachować kontrolę, ale sytuacja wymusza odsłonięcie słabości.",
      romanticTension: romance,
      revealedSecret: isMid || isCrisis || isFinal ? secrets : "Delikatna poszlaka, jeszcze bez pełnego wyjaśnienia.",
      openingScene: "Scena zaczyna się od konkretnego gestu, miejsca albo decyzji, nie od ekspozycji.",
      middleScene: "Rozmowa lub zdarzenie zmienia interpretację relacji między postaciami.",
      endingScene: isFinal ? ending : "Rozdział kończy się obrazem, który zostawia emocjonalny niepokój.",
      cliffhanger: isFinal ? "Finałowy obraz zamiast klasycznego cliffhangera." : "Nowe pytanie albo niebezpieczne niedopowiedzenie.",
      readerFeeling: input.tone || "Ciche napięcie, ciekawość i emocjonalny niedosyt.",
      songOrVibe: "Cinematic, intymnie, z wyraźnym podskórnym napięciem."
    };
  });

  return {
    logline: `${title}: ${premise}`,
    actStructure: actLabels.map((label, index) => `${label}: ${index === 0 ? "wejście w konflikt" : index === 4 ? ending : "eskalacja stawki i emocji"}.`),
    chapters
  };
}
