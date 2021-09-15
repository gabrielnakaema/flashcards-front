import api from './api';
import { Deck, DeckDetails } from '../types';

interface NewDeck {
  title: string;
  description: string;
}

export const getDecks = async () => {
  const response = await api.get<Deck[]>('/v1/decks');
  return response.data;
};

export const getDeckDetailById = async (id: number | string) => {
  const response = await api.get<DeckDetails>(`/v1/decks/${id}`);
  return response.data;
};

export const createDeck = async (newDeck: NewDeck) => {
  const response = await api.post<Deck>(`/v1/decks`, newDeck);
  return response.data;
};

export const removeDeck = async (id: number | string) => {
  await api.delete<void>(`/v1/decks/${id}`);
};
