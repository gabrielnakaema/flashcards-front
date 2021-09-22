import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card as MatCard,
  CardActions as MatCardActions,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getCardsFromDeck,
  getRandomCardsFromDeck,
} from '../services/cardService';
import { Card } from '../types';
import { AlertContext } from '../contexts/AlertContext';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const CardStudy = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isAnswerShown, setIsAnswerShown] = useState<boolean>(false);
  const [isHintShown, setIsHintShown] = useState<boolean>(false);
  const { setAlert } = useContext(AlertContext);
  const numberOfCards = cards.length;
  const searchParams = useQuery();

  useEffect(() => {
    async function fetchData() {
      try {
        if (searchParams.get('shuffle')) {
          const cards = await getRandomCardsFromDeck(deckId);
          setCards(cards);
        } else {
          const cards = await getCardsFromDeck(deckId);
          setCards(cards);
        }
      } catch (error) {
        setAlert(extractErrorMessage(error), 'error', 3000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId, setAlert]);

  const nextCard = () => {
    if (currentCardIndex >= numberOfCards - 1) {
      return;
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsAnswerShown(false);
      setIsHintShown(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex <= 0) {
      return;
    } else {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsAnswerShown(false);
      setIsHintShown(false);
    }
  };

  if (numberOfCards === 0) {
    return <Box>Deck does not have any cards</Box>;
  } else {
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
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            color="inherit"
            component={RouterLink}
            to={`/decks/${deckId}`}
          >
            Back
          </Button>
          <Typography sx={{ marginLeft: 'auto' }}>
            Card {currentCardIndex + 1} of {numberOfCards}
          </Typography>
        </Box>
        <MatCard
          sx={{
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography sx={{ margin: '5rem auto' }} variant="h3">
            {cards[currentCardIndex].question}
          </Typography>
          <Typography
            sx={{
              margin: '0 auto 3rem auto',
              visibility: isHintShown ? 'visible' : 'hidden',
            }}
            variant="caption"
          >
            {cards[currentCardIndex].hint}
          </Typography>
          <Typography
            sx={{
              margin: '0 auto 5rem auto',
              visibility: isAnswerShown ? 'visible' : 'hidden',
            }}
            variant="subtitle1"
          >
            {cards[currentCardIndex].answer}
          </Typography>
          <MatCardActions sx={{ margin: '1rem auto' }}>
            {isAnswerShown ? (
              <>
                <Button
                  onClick={previousCard}
                  sx={{
                    visibility: currentCardIndex <= 0 ? 'hidden' : 'visible',
                  }}
                >
                  {' '}
                  Previous{' '}
                </Button>

                <Button
                  onClick={nextCard}
                  sx={{
                    visibility:
                      currentCardIndex >= numberOfCards - 1
                        ? 'hidden'
                        : 'visible',
                  }}
                >
                  {' '}
                  Next{' '}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsAnswerShown(true)}>
                  Show answer
                </Button>
                {cards[currentCardIndex].hint && (
                  <Button onClick={() => setIsHintShown(true)}>
                    Show hint
                  </Button>
                )}
              </>
            )}
          </MatCardActions>
        </MatCard>
      </Box>
    );
  }
};
