import {
  Box,
  Button,
  Card as MatCard,
  CardActions as MatCardActions,
  CardContent as MatCardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink, useHistory } from 'react-router-dom';
import { AlertContext } from '../contexts/AlertContext';
import { getDeckDetailById, removeDeck } from '../services/deckService';
import { DeckDetails } from '../types';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const DeckDetail = () => {
  const [details, setDetails] = useState<DeckDetails>();
  const { deckId } = useParams<{ deckId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setAlert } = useContext(AlertContext);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const data = await getDeckDetailById(deckId);
      setDetails(data);
    }
    fetchData();
  }, [deckId]);

  const remove = async () => {
    if (details) {
      try {
        await removeDeck(details.id);
        setAlert(`Removed deck ${details.title}`, 'success', 3000);
        setDialogOpen(false);
        history.push('/');
      } catch (error: any) {
        setAlert(extractErrorMessage(error), 'error', 3000);
      }
    }
  };

  if (details) {
    return (
      <Box
        sx={{
          margin: {
            xs: '1rem 0.5rem',
            sm: '1rem 2rem',
            md: '1rem 4rem',
          },
        }}
      >
        <Button
          component={RouterLink}
          to="/"
          style={{ textDecoration: 'none', color: '#333' }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <MatCard data-testid="deck-detail">
          <MatCardContent>
            {details.title}
            <br />
            {details.description}
            <br />
            Added by {details.user.username}
            <br />
            This deck contains {details.cardCount} cards
          </MatCardContent>
          <MatCardActions>
            <Button
              component={RouterLink}
              to={`/decks/${details.id}/cards/study`}
              style={{ visibility: !details.cardCount ? 'hidden' : 'visible' }}
            >
              Study now!
            </Button>
          </MatCardActions>
          <MatCardActions>
            <Button
              component={RouterLink}
              to={`/decks/${details.id}/cards/add`}
            >
              Add new cards
            </Button>
            <Button
              component={RouterLink}
              to={`/decks/${details.id}/cards/list`}
              style={{ display: !details.cardCount ? 'none' : 'inherit' }}
            >
              Card list
            </Button>
            <Button onClick={() => setDialogOpen(true)}>Remove deck</Button>
          </MatCardActions>
        </MatCard>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Delete deck</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to remove this deck?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={remove} color="secondary">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  } else {
    return null;
  }
};
