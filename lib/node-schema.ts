import type { NodeType, TabSchema } from "@/lib/types";

export const nodeTypes: NodeType[] = [
  "Postać",
  "Fabuła",
  "Rozdział",
  "Relacja",
  "Świat",
  "Motyw",
  "Tajemnica",
  "Sekret",
  "Scena",
  "Timeline",
  "Organizacja",
  "Rodzina",
  "Lokacja",
  "Cytat",
  "Muzyka",
  "Notatka",
  "Inne"
];

export const accentColors = [
  "#8f3147",
  "#263247",
  "#6f7f72",
  "#b58145",
  "#4b5563",
  "#7c3f58",
  "#315a70"
];

export const nodeTypeSchemas: Partial<Record<NodeType, TabSchema[]>> = {
  Postać: [
    {
      id: "basic",
      label: "Podstawowe",
      sections: [
        {
          id: "identity",
          title: "Tożsamość",
          defaultOpen: true,
          fields: [
        { key: "firstName", label: "Imię", kind: "text" },
        { key: "middleName", label: "Drugie imię", kind: "text" },
        { key: "lastName", label: "Nazwisko", kind: "text" },
        { key: "nicknames", label: "Ksywki", kind: "tags" },
        { key: "nicknameUsers", label: "Kto używa której ksywki", kind: "textarea" },
        { key: "age", label: "Wiek", kind: "number" },
        { key: "birthDate", label: "Data urodzenia", kind: "text" },
        { key: "birthPlace", label: "Miejsce urodzenia", kind: "text" },
        { key: "homePlace", label: "Miejsce zamieszkania", kind: "text" },
        { key: "nationality", label: "Narodowość", kind: "text" },
        { key: "origin", label: "Pochodzenie", kind: "textarea" },
        { key: "languages", label: "Języki", kind: "tags" },
        { key: "schoolWork", label: "Szkoła / praca", kind: "text" },
        { key: "relationshipStatus", label: "Status związku", kind: "text" }
          ]
        },
        {
          id: "family-status",
          title: "Rodzina i status",
          fields: [
            { key: "orientation", label: "Orientacja", kind: "text" },
            { key: "parents", label: "Rodzice", kind: "textarea" },
            { key: "siblings", label: "Rodzeństwo", kind: "textarea" },
            { key: "children", label: "Dzieci", kind: "textarea" },
            { key: "maritalStatus", label: "Stan cywilny", kind: "text" },
            { key: "financialSituation", label: "Sytuacja finansowa", kind: "textarea" },
            { key: "carDriving", label: "Auto / prawo jazdy", kind: "text" },
            { key: "socialMediaVibe", label: "Social media vibe", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "appearance",
      label: "Wygląd",
      sections: [
        {
          id: "body-face",
          title: "Ciało i twarz",
          defaultOpen: true,
          fields: [
            { key: "height", label: "Wzrost", kind: "text" },
            { key: "body", label: "Sylwetka", kind: "text" },
            { key: "posture", label: "Postura", kind: "text" },
            { key: "walkingStyle", label: "Sposób chodzenia", kind: "textarea" },
            { key: "bodyEnergy", label: "Energia ciała", kind: "textarea" },
            { key: "face", label: "Twarz", kind: "textarea" },
            { key: "faceShape", label: "Kształt twarzy", kind: "text" },
            { key: "eyes", label: "Oczy", kind: "text" },
            { key: "gaze", label: "Spojrzenie", kind: "textarea" },
            { key: "lashes", label: "Rzęsy", kind: "text" },
            { key: "brows", label: "Brwi", kind: "text" },
            { key: "nose", label: "Nos", kind: "text" },
            { key: "lips", label: "Usta", kind: "text" },
            { key: "complexion", label: "Cera", kind: "text" },
            { key: "freckles", label: "Piegi", kind: "text" },
            { key: "scars", label: "Blizny", kind: "textarea" },
            { key: "birthmarks", label: "Znamiona", kind: "textarea" }
          ]
        },
        {
          id: "hair-style",
          title: "Włosy, głos i styl",
          fields: [
            { key: "hair", label: "Włosy", kind: "text" },
            { key: "hairColor", label: "Kolor włosów", kind: "text" },
            { key: "hairLength", label: "Długość włosów", kind: "text" },
            { key: "hairTexture", label: "Tekstura włosów", kind: "text" },
            { key: "morningHair", label: "Jak wyglądają rano", kind: "textarea" },
            { key: "partyHair", label: "Jak wyglądają po imprezie", kind: "textarea" },
            { key: "voice", label: "Głos", kind: "text" },
            { key: "laugh", label: "Śmiech", kind: "text" },
            { key: "scent", label: "Zapach", kind: "text" },
            { key: "clothingStyle", label: "Styl ubierania", kind: "textarea" },
            { key: "clothingColors", label: "Ulubione kolory ubrań", kind: "tags" },
            { key: "jewelry", label: "Biżuteria", kind: "textarea" },
            { key: "shoes", label: "Buty", kind: "textarea" },
            { key: "makeup", label: "Makijaż", kind: "textarea" },
            { key: "signatureDetails", label: "Charakterystyczne detale", kind: "textarea" },
            { key: "appearanceDescription", label: "Pełny opis wyglądu do AI", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "personality",
      label: "Osobowość",
      sections: [
        {
          id: "social-energy",
          title: "Energia i temperament",
          defaultOpen: true,
          fields: [
            { key: "firstImpression", label: "Pierwsze wrażenie", kind: "textarea" },
            { key: "groupEnergy", label: "Energia w grupie", kind: "textarea" },
            { key: "aloneEnergy", label: "Energia sam na sam", kind: "textarea" },
            { key: "temperament", label: "Temperament", kind: "textarea" },
            { key: "humor", label: "Poczucie humoru", kind: "textarea" },
            { key: "emotionalIntelligence", label: "Inteligencja emocjonalna", kind: "textarea" }
          ]
        },
        {
          id: "traits",
          title: "Cechy i zachowania",
          fields: [
            { key: "strengths", label: "Największe zalety", kind: "textarea" },
            { key: "flaws", label: "Największe wady", kind: "textarea" },
            { key: "morality", label: "Moralność", kind: "textarea" },
            { key: "confidence", label: "Pewność siebie", kind: "textarea" },
            { key: "impulsiveness", label: "Impulsywność", kind: "textarea" },
            { key: "jealousy", label: "Zazdrość", kind: "textarea" },
            { key: "romanticism", label: "Romantyczność", kind: "textarea" },
            { key: "patience", label: "Cierpliwość", kind: "textarea" },
            { key: "lyingStyle", label: "Sposób kłamania", kind: "textarea" },
            { key: "apologyStyle", label: "Sposób przepraszania", kind: "textarea" },
            { key: "loveLanguage", label: "Sposób okazywania miłości", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "psychology",
      label: "Psychologia",
      sections: [
        {
          id: "wounds",
          title: "Rany, lęki i pragnienia",
          defaultOpen: true,
          fields: [
            { key: "biggestFear", label: "Największy lęk", kind: "textarea" },
            { key: "biggestDesire", label: "Największe pragnienie", kind: "textarea" },
            { key: "emotionalWound", label: "Największa rana emocjonalna", kind: "textarea" },
            { key: "trauma", label: "Trauma", kind: "textarea" },
            { key: "secret", label: "Sekret", kind: "textarea" },
            { key: "shame", label: "Czego się wstydzi", kind: "textarea" },
            { key: "triggers", label: "Co ją/jego triggeruje", kind: "textarea" },
            { key: "neverSays", label: "Czego nigdy nie mówi na głos", kind: "textarea" }
          ]
        },
        {
          id: "reactions",
          title: "Reakcje emocjonalne",
          fields: [
            { key: "defenseMechanisms", label: "Mechanizmy obronne", kind: "textarea" },
            { key: "attachmentStyle", label: "Styl przywiązania", kind: "text" },
            { key: "stressReaction", label: "Reakcja na stres", kind: "textarea" },
            { key: "lonelinessReaction", label: "Reakcja na samotność", kind: "textarea" },
            { key: "rejectionReaction", label: "Reakcja na odrzucenie", kind: "textarea" },
            { key: "loveReaction", label: "Reakcja na miłość", kind: "textarea" },
            { key: "selfDestructive", label: "Autodestrukcyjne zachowania", kind: "textarea" },
            { key: "emotionalBreak", label: "Co robi kiedy pęka emocjonalnie", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "quirks",
      label: "Quirks & flaws",
      sections: [
        {
          id: "quirks-daily",
          title: "Codzienność i drobiazgi",
          defaultOpen: true,
          fields: [
            { key: "habits", label: "Dziwne nawyki", kind: "textarea" },
            { key: "microgestures", label: "Mikrogesty", kind: "textarea" },
            { key: "nervousTics", label: "Tiki nerwowe", kind: "textarea" },
            { key: "favoriteThings", label: "Ulubione rzeczy", kind: "textarea" },
            { key: "hatedThings", label: "Rzeczy których nienawidzi", kind: "textarea" },
            { key: "comfortItems", label: "Comfort items", kind: "textarea" },
            { key: "phoneHabits", label: "Nawyki w telefonie", kind: "textarea" },
            { key: "textingStyle", label: "Sposób pisania wiadomości", kind: "textarea" },
            { key: "emoji", label: "Emoji", kind: "text" },
            { key: "favoriteFood", label: "Ulubione jedzenie", kind: "text" },
            { key: "favoriteDrink", label: "Ulubiony napój", kind: "text" },
            { key: "music", label: "Muzyka", kind: "textarea" },
            { key: "alwaysCarries", label: "Rzeczy które zawsze ma przy sobie", kind: "textarea" }
          ]
        },
        {
          id: "flaws-toxic",
          title: "Wady i słabości",
          fields: [
            { key: "flaws", label: "Wady", kind: "textarea" },
            { key: "toxicBehaviors", label: "Toksyczne zachowania", kind: "textarea" },
            { key: "weaknesses", label: "Słabości", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "relationships",
      label: "Relacje",
      sections: [
        {
          id: "family-relations",
          title: "Bliscy",
          defaultOpen: true,
          fields: [
            { key: "motherRelation", label: "Relacja z matką", kind: "textarea" },
            { key: "fatherRelation", label: "Relacja z ojcem", kind: "textarea" },
            { key: "siblingsRelation", label: "Relacja z rodzeństwem", kind: "textarea" },
            { key: "friendsRelation", label: "Relacja z przyjaciółmi", kind: "textarea" },
            { key: "romanticRelations", label: "Relacje romantyczne", kind: "textarea" },
            { key: "exes", label: "Ex", kind: "textarea" }
          ]
        },
        {
          id: "relation-map",
          title: "Napięcia i mapa relacji",
          fields: [
            { key: "biggestRelationshipConflict", label: "Największy konflikt relacyjny", kind: "textarea" },
            { key: "mostTrustedPerson", label: "Osoba której ufa najbardziej", kind: "text" },
            { key: "leastTrustedPerson", label: "Osoba której nie ufa", kind: "text" },
            { key: "secretKeeper", label: "Kto zna jej/jego sekret", kind: "textarea" },
            { key: "understandsThem", label: "Kto ją/jego rozumie", kind: "textarea" },
            { key: "destroysThem", label: "Kto ją/jego niszczy emocjonalnie", kind: "textarea" },
            { key: "nodeRelationMap", label: "Mapa relacji z innymi node’ami", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "backstory",
      label: "Backstory",
      sections: [
        {
          id: "past",
          title: "Przeszłość",
          defaultOpen: true,
          fields: [
            { key: "childhood", label: "Dzieciństwo", kind: "textarea" },
            { key: "familyHome", label: "Dom rodzinny", kind: "textarea" },
            { key: "school", label: "Szkoła", kind: "textarea" },
            { key: "firstFriendship", label: "Pierwsza przyjaźń", kind: "textarea" },
            { key: "firstHeartbreak", label: "Pierwszy heartbreak", kind: "textarea" },
            { key: "firstParty", label: "Pierwsza impreza", kind: "textarea" },
            { key: "biggestMistake", label: "Największy błąd", kind: "textarea" },
            { key: "bestMemory", label: "Najważniejsze wspomnienie", kind: "textarea" },
            { key: "worstMemory", label: "Najgorsze wspomnienie", kind: "textarea" },
            { key: "changeMoment", label: "Moment który ją/jego zmienił", kind: "textarea" },
            { key: "regrets", label: "Czego żałuje", kind: "textarea" },
            { key: "neverForgets", label: "Czego nigdy nie zapomni", kind: "textarea" },
            { key: "lifeStory", label: "Pełna historia życia", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "arc",
      label: "Character Arc",
      sections: [
        {
          id: "arc-main",
          title: "Łuk postaci",
          defaultOpen: true,
          fields: [
            { key: "beginsAs", label: "Zaczyna jako...", kind: "textarea" },
            { key: "becomes", label: "Z czasem staje się...", kind: "textarea" },
            { key: "wantsAtStart", label: "Czego chce na początku", kind: "textarea" },
            { key: "reallyNeeds", label: "Czego naprawdę potrzebuje", kind: "textarea" },
            { key: "falseBelief", label: "Błędne przekonanie", kind: "textarea" },
            { key: "mustUnderstand", label: "Co musi zrozumieć", kind: "textarea" },
            { key: "loses", label: "Co traci", kind: "textarea" },
            { key: "gains", label: "Co zyskuje", kind: "textarea" },
            { key: "finalVersion", label: "Finałowa wersja postaci", kind: "textarea" },
            { key: "arcVolumeOne", label: "Łuk w tomie 1", kind: "textarea" },
            { key: "arcVolumeTwo", label: "Łuk w tomie 2", kind: "textarea" },
            { key: "arcVolumeThree", label: "Łuk w tomie 3", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "scenes",
      label: "Sceny",
      sections: [
        {
          id: "key-scenes",
          title: "Sceny kluczowe",
          defaultOpen: true,
          fields: [
            { key: "entranceScene", label: "Scena wejścia", kind: "textarea" },
            { key: "firstImportantTalk", label: "Scena pierwszej ważnej rozmowy", kind: "textarea" },
            { key: "argumentScene", label: "Scena kłótni", kind: "textarea" },
            { key: "jealousyScene", label: "Scena zazdrości", kind: "textarea" },
            { key: "breakdownScene", label: "Scena załamania", kind: "textarea" },
            { key: "romanticScene", label: "Scena romantyczna", kind: "textarea" },
            { key: "truthScene", label: "Scena prawdy", kind: "textarea" },
            { key: "finalScene", label: "Scena finałowa", kind: "textarea" },
            { key: "importantQuotes", label: "Najważniejsze cytaty", kind: "textarea" },
            { key: "relatedChapters", label: "Powiązane rozdziały", kind: "tags" }
          ]
        }
      ]
    },
    {
      id: "symbolism",
      label: "Symbolika",
      sections: [
        {
          id: "symbols",
          title: "Kod symboliczny",
          defaultOpen: true,
          fields: [
            { key: "symbolColor", label: "Kolor postaci", kind: "text" },
            { key: "timeOfDay", label: "Pora dnia", kind: "text" },
            { key: "weather", label: "Pogoda", kind: "text" },
            { key: "symbolScent", label: "Zapach", kind: "text" },
            { key: "symbolMusic", label: "Piosenka", kind: "text" },
            { key: "symbolPlace", label: "Miejsce", kind: "text" },
            { key: "aesthetic", label: "Estetyka", kind: "textarea" },
            { key: "motif", label: "Motyw przewodni", kind: "textarea" },
            { key: "symbolQuote", label: "Cytat definiujący postać", kind: "textarea" },
            { key: "symbolObject", label: "Przedmiot symboliczny", kind: "textarea" }
          ]
        }
      ]
    },
    {
      id: "photos",
      label: "Zdjęcia i moodboard",
      sections: [
        {
          id: "visual-identity",
          title: "Tożsamość wizualna",
          defaultOpen: true,
          fields: [
            { key: "visualAesthetic", label: "Opis estetyki", kind: "textarea" },
            { key: "visualColors", label: "Kolory", kind: "tags" },
            { key: "visualVibe", label: "Vibe wizualny", kind: "textarea" },
            { key: "visualInspirations", label: "Inspiracje", kind: "textarea" },
            { key: "aiImagePrompt", label: "Opis do AI image generation", kind: "textarea" },
            { key: "faceInspirations", label: "Inspiracje twarzy", kind: "textarea" },
            { key: "styleInspirations", label: "Inspiracje stylu i ubrań", kind: "textarea" },
            { key: "moodboardNotes", label: "Moodboard", kind: "textarea" }
          ]
        }
      ]
    },
    { id: "notes", label: "Notatki", sections: [{ id: "notes", title: "Notatki", defaultOpen: true, fields: [{ key: "privateNotes", label: "Notatki", kind: "textarea" }] }] }
  ],
  Rozdział: [
    {
      id: "chapter",
      label: "Rozdział",
      sections: [{ id: "chapter-main", title: "Struktura rozdziału", defaultOpen: true, fields: [
        { key: "chapterNumber", label: "Numer rozdziału", kind: "number" },
        { key: "chapterTitle", label: "Tytuł", kind: "text" },
        { key: "pov", label: "POV", kind: "text" },
        { key: "place", label: "Miejsce", kind: "text" },
        { key: "actionTime", label: "Czas akcji", kind: "text" },
        { key: "characters", label: "Bohaterowie", kind: "tags" },
        { key: "chapterGoal", label: "Cel rozdziału", kind: "textarea" },
        { key: "plotFunction", label: "Funkcja fabularna", kind: "textarea" },
        { key: "emotionalFunction", label: "Funkcja emocjonalna", kind: "textarea" },
        { key: "externalConflict", label: "Konflikt zewnętrzny", kind: "textarea" },
        { key: "internalConflict", label: "Konflikt wewnętrzny", kind: "textarea" },
        { key: "romanticTension", label: "Napięcie romantyczne", kind: "textarea" },
        { key: "revealedSecret", label: "Sekret / informacja ujawniona", kind: "textarea" },
        { key: "chapterEmotion", label: "Emocja rozdziału", kind: "text" },
        { key: "readerFeeling", label: "Co czytelnik ma czuć", kind: "textarea" },
        { key: "openingScene", label: "Scena otwierająca", kind: "textarea" },
        { key: "middleScene", label: "Scena środkowa", kind: "textarea" },
        { key: "endingScene", label: "Scena końcowa", kind: "textarea" },
        { key: "cliffhanger", label: "Cliffhanger", kind: "textarea" },
        { key: "openingQuote", label: "Cytat otwierający", kind: "textarea" },
        { key: "song", label: "Piosenka", kind: "text" },
        { key: "chapterChange", label: "Co zmienia się po tym rozdziale", kind: "textarea" },
        { key: "chapterVibePhotos", label: "Zdjęcia / vibe rozdziału", kind: "textarea" },
        { key: "chapterNotes", label: "Notatki", kind: "textarea" }
      ]}]
    }
  ],
  Relacja: [
    {
      id: "relation",
      label: "Relacja",
      sections: [{ id: "relation-main", title: "Dynamika relacji", defaultOpen: true, fields: [
        { key: "characterA", label: "Postać A", kind: "text" },
        { key: "characterB", label: "Postać B", kind: "text" },
        { key: "relationType", label: "Typ relacji", kind: "text" },
        { key: "firstImpression", label: "Pierwsze wrażenie", kind: "textarea" },
        { key: "dynamic", label: "Dynamika", kind: "textarea" },
        { key: "relationshipHistory", label: "Historia relacji", kind: "textarea" },
        { key: "biggestTension", label: "Największe napięcie", kind: "textarea" },
        { key: "biggestConflict", label: "Największy konflikt", kind: "textarea" },
        { key: "biggestSecret", label: "Największy sekret", kind: "textarea" },
        { key: "trustLevel", label: "Poziom zaufania 1-10", kind: "number", min: 1, max: 10 },
        { key: "tensionLevel", label: "Poziom napięcia 1-10", kind: "number", min: 1, max: 10 },
        { key: "jealousyLevel", label: "Poziom zazdrości 1-10", kind: "number", min: 1, max: 10 },
        { key: "obsessionLevel", label: "Poziom obsesji 1-10", kind: "number", min: 1, max: 10 },
        { key: "safetyLevel", label: "Poziom bezpieczeństwa 1-10", kind: "number", min: 1, max: 10 },
        { key: "argumentStyle", label: "Jak się kłócą", kind: "textarea" },
        { key: "flirtStyle", label: "Jak flirtują", kind: "textarea" },
        { key: "unsaidThings", label: "Czego sobie nie mówią", kind: "textarea" },
        { key: "pullsTogether", label: "Co ich do siebie ciągnie", kind: "textarea" },
        { key: "destroysThem", label: "Co ich niszczy", kind: "textarea" },
        { key: "turningScene", label: "Scena przełomowa", kind: "textarea" },
        { key: "relationFinal", label: "Finał relacji", kind: "textarea" },
        { key: "relationMoodboard", label: "Moodboard relacji", kind: "textarea" },
        { key: "relationSong", label: "Piosenka relacji", kind: "text" },
        { key: "relationPhotos", label: "Zdjęcia relacji", kind: "textarea" }
      ]}]
    }
  ],
  Fabuła: [
    {
      id: "plot",
      label: "Fabuła",
      sections: [{ id: "plot-arc", title: "Wątek fabularny", defaultOpen: true, fields: [
        { key: "plotTitle", label: "Tytuł wątku", kind: "text" },
        { key: "plotDescription", label: "Opis wątku", kind: "textarea" },
        { key: "volume", label: "Tom", kind: "text" },
        { key: "act", label: "Akt", kind: "text" },
        { key: "beginning", label: "Początek", kind: "textarea" },
        { key: "turningPoint", label: "Punkt zwrotny", kind: "textarea" },
        { key: "midpoint", label: "Punkt środkowy", kind: "textarea" },
        { key: "crisis", label: "Kryzys", kind: "textarea" },
        { key: "finale", label: "Finał", kind: "textarea" },
        { key: "mysteries", label: "Tajemnice", kind: "textarea" },
        { key: "consequences", label: "Konsekwencje", kind: "textarea" },
        { key: "involvedCharacters", label: "Bohaterowie zaangażowani", kind: "tags" },
        { key: "relatedChapters", label: "Powiązane rozdziały", kind: "tags" },
        { key: "emotionalMeaning", label: "Emocjonalny sens wątku", kind: "textarea" },
        { key: "plotMoodboard", label: "Zdjęcia / moodboard wątku", kind: "textarea" }
      ]}]
    }
  ],
  Timeline: [
    {
      id: "timeline",
      label: "Timeline",
      fields: [
        { key: "events", label: "Wydarzenia", kind: "textarea" },
        { key: "past", label: "Przeszłość", kind: "textarea" },
        { key: "present", label: "Teraźniejszość", kind: "textarea" },
        { key: "future", label: "Przyszłość", kind: "textarea" },
        { key: "characterTimeline", label: "Timeline postaci", kind: "textarea" },
        { key: "plotTimeline", label: "Timeline fabuły", kind: "textarea" }
      ]
    }
  ]
};

export const sharedPhotosTab: TabSchema = {
  id: "photos",
  label: "Zdjęcia i moodboard",
  sections: [
    {
      id: "visual-identity",
      title: "Tożsamość wizualna",
      defaultOpen: true,
      fields: [
        { key: "visualAesthetic", label: "Opis estetyki", kind: "textarea" },
        { key: "visualColors", label: "Kolory", kind: "tags" },
        { key: "visualVibe", label: "Vibe wizualny", kind: "textarea" },
        { key: "visualInspirations", label: "Inspiracje", kind: "textarea" },
        { key: "aiImagePrompt", label: "Opis do AI image generation", kind: "textarea" }
      ]
    }
  ]
};

export const sharedAiPlotTab: TabSchema = {
  id: "ai-plot",
  label: "AI fabuła rozdziałów"
};

export const defaultSchema: TabSchema[] = [
  {
    id: "general",
    label: "Szczegóły",
    sections: [
      {
        id: "general-main",
        title: "Szczegóły",
        defaultOpen: true,
        fields: [
          { key: "summary", label: "Streszczenie", kind: "textarea" },
          { key: "purpose", label: "Cel w historii", kind: "textarea" },
          { key: "references", label: "Cytaty / playlisty / inspiracje", kind: "textarea" }
        ]
      }
    ]
  }
];

export function getSchemaForType(type: NodeType) {
  const schema = nodeTypeSchemas[type] ?? defaultSchema;
  const withPhotos = schema.some((tab) => tab.id === "photos") ? schema : [...schema, sharedPhotosTab];
  return withPhotos.some((tab) => tab.id === "ai-plot") ? withPhotos : [...withPhotos, sharedAiPlotTab];
}
