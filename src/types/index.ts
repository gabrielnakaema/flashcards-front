export interface Deck {
  id: number;
  title: string;
  description: string;
}

export interface DeckDetails {
  id: number;
  title: string;
  description: string;
  cardCount: number;
  user: {
    username: string;
    name: string;
  };
}

export interface Card {
  id: number;
  question: string;
  answer: string;
  hint: string;
}
