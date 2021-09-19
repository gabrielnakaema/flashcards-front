import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card as MatCard,
  CardActions as MatCardActions,
  Typography,
} from '@mui/material';
import { getCardsFromDeck } from '../services/cardService';
import { Card } from '../types';
import { AlertContext } from '../contexts/AlertContext';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const CardStudy = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isAnswerShown, setIsAnswerShown] = useState<boolean>(false);
  const [isHintShown, setIsHintShown] = useState<boolean>(false);
  const { setAlert } = useContext(AlertContext);
  const numberOfCards = cards.length;

  useEffect(() => {
    async function fetchData() {
      try {
        const cards = await getCardsFromDeck(deckId);
        setCards(cards);
      } catch (error) {
        setAlert(extractErrorMessage(error), 'error', 3000);
      }
    }
    fetchData();
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
      <Box sx={{}}>
        <MatCard
          sx={{
            margin: {
              xs: '1rem 0.5rem',
              sm: '1rem 2rem',
              md: '1rem 4rem',
            },
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
