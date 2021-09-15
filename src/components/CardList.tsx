import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { getCardsFromDeck } from '../services/cardService';
import { AlertContext } from '../contexts/AlertContext';
import { Card } from '../types';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const CardList = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    async function fetchData() {
      try{
        const cards = await getCardsFromDeck(deckId);
        setCards(cards);
      }catch(error){
        setAlert(extractErrorMessage(error), 'error', 3000)
      }
    }
    fetchData();
  }, [deckId, setAlert]);

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
