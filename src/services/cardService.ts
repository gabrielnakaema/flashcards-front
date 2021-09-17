import api from './api';
import { Card } from '../types';

interface NewCard {
  question: string;
  answer: string;
  hint?: string;
}

export const getCardsFromDeck = async (deckId: string | number) => {
  const response = await api.get<Card[]>(`/v1/decks/${deckId}/cards`);
  return response.data;
};

export const createCards = async (
  deckId: string | number,
  cards: NewCard[]
) => {
  const response = await api.post<Card[]>(`/v1/decks/${deckId}/cards`, cards);
  return response.data;
};
