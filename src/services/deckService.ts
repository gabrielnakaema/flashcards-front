import api from './api';
import { Deck, DeckDetails } from '../types';

export const getDecks = async () => {
  const response = await api.get('/v1/decks');
  return response.data as Deck[];
};

export const getDeckDetailById = async (id: number | string) => {
  const response = await api.get(`/v1/decks/${id}`);
  return response.data as DeckDetails;
};
