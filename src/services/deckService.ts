import axios from "axios";
import { Deck } from "../types";

const BASE_API_URL = process.env.REACT_APP_API_URL as string;

export const getDecks = async () => {
  const response = await axios.get(`${BASE_API_URL}/v1/decks`);
  return response.data as Deck[];
};
