import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card as MatCard,
  CardActions as MatCardActions,
} from '@material-ui/core';
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
    return <div>Deck does not have any cards</div>;
  } else {
    return (
      <div>
        <MatCard>
          {cards[currentCardIndex].question}
          {isHintShown && <div>{cards[currentCardIndex].hint}</div>}
          {isAnswerShown && <div>{cards[currentCardIndex].answer}</div>}
          <MatCardActions>
            {isAnswerShown ? (
              <>
                <Button
                  onClick={previousCard}
                  style={{
                    visibility: currentCardIndex <= 0 ? 'hidden' : 'visible',
                  }}
                >
                  {' '}
                  Previous{' '}
                </Button>

                <Button
                  onClick={nextCard}
                  style={{
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
                <Button
                  onClick={() => setIsHintShown(true)}
                  style={{
                    visibility:
                      isHintShown || !cards[currentCardIndex].hint
                        ? 'hidden'
                        : 'visible',
                  }}
                >
                  Show hint
                </Button>
              </>
            )}
          </MatCardActions>
        </MatCard>
      </div>
    );
  }
};
