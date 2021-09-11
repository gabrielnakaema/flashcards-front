import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { getCardsFromDeck } from '../services/cardService';
import { Card } from '../types';

export const CardList = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    async function fetchData() {
      const cards = await getCardsFromDeck(deckId);
      setCards(cards);
    }
    fetchData();
  }, [deckId]);

  if (cards.length === 0) {
    return <div>Loading...</div>;
  } else {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Answer</TableCell>
            <TableCell>Hint</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>{card.question}</TableCell>
              <TableCell>{card.answer}</TableCell>
              <TableCell>{card.hint}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
};
