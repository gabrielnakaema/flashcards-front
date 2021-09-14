import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getDecks } from '../services/deckService';
import { Deck } from '../types';

export const DeckTable = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const data = await getDecks();
      setDecks(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Button
        component="a"
        onClick={() => {
          history.push('/decks/create');
        }}
      >
        <AddIcon />
        Add deck
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody data-testid="deck-table-body">
          {decks
            ? decks.map((deck) => (
                <TableRow
                  key={deck.id}
                  hover
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                  onClick={() => history.push(`/decks/${deck.id}`)}
                >
                  <TableCell>{deck.id}</TableCell>
                  <TableCell>{deck.title}</TableCell>
                  <TableCell>{deck.description}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};
