import api from './api';
import { Card } from '../types';

export const getCardsFromDeck = async (deckId: string | number) => {
  const response = await api.get<Card[]>(`/v1/decks/${deckId}/cards`);
  return response.data;
};
