import axios from 'axios';
import { Card } from '../types';

const BASE_API_URL = process.env.REACT_APP_API_URL as string;

export const getCardsFromDeck = async (deckId: string | number) => {
  const response = await axios.get<Card[]>(
    `${BASE_API_URL}/v1/decks/${deckId}/cards`
  );
  return response.data;
};
