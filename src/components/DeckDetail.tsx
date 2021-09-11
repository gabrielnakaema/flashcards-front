import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getDeckDetailById } from '../services/deckService';
import { DeckDetails } from '../types';

export const DeckDetail = () => {
  const [details, setDetails] = useState<DeckDetails>();
  const { deckId } = useParams<{ deckId: string }>();

  useEffect(() => {
    async function fetchData() {
      const data = await getDeckDetailById(deckId);
      setDetails(data);
    }
    fetchData();
  }, [deckId]);

  if (details) {
    return (
      <div>
        <Link
          component={RouterLink}
          to="/"
          style={{ textDecoration: 'none', color: '#333' }}
        >
          <ArrowBackIcon />
        </Link>
        <Card data-testid="deck-detail">
          <CardContent>
            {details.title}
            <br />
            {details.description}
            <br />
            Added by {details.user.username}
            <br />
            This deck contains {details.cardCount} cards
          </CardContent>
          <CardActions>
            <Button
              component={RouterLink}
              to={`/decks/${details.id}/cards/study`}
              style={{ visibility: !details.cardCount ? 'hidden' : 'visible' }}
            >
              Study now!
            </Button>
          </CardActions>
          <CardActions>
            <Button component={RouterLink} to="/">
              Add new cards
            </Button>
            <Button
              component={RouterLink}
              to="/"
              style={{ display: !details.cardCount ? 'none' : 'inherit' }}
            >
              Cards list
            </Button>
            <Button component={RouterLink} to="/">
              Remove deck
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  } else {
    return null;
  }
};
