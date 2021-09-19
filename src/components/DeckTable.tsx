import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getDecks } from '../services/deckService';
import { Deck } from '../types';
import { AlertContext } from '../contexts/AlertContext';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const DeckTable = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const history = useHistory();
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDecks();
        setDecks(data);
      } catch (error: any) {
        setAlert(extractErrorMessage(error), 'error', 3000);
      }
    }
    fetchData();
  }, [setAlert]);

  return (
    <Paper
      sx={{
        margin: {
          xs: '1rem 0.5rem',
          sm: '1rem 2rem',
          md: '1rem 4rem',
        },
      }}
    >
      <Button
        component="a"
        onClick={() => {
          history.push('/decks/create');
        }}
        startIcon={<AddIcon />}
        sx={{ margin: '1rem 0 0 1rem' }}
        variant="outlined"
      >
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
    </Paper>
  );
};
