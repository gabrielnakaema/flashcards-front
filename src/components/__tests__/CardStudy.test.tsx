import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Card } from '../../types';
import { CardStudy } from '../CardStudy';
jest.mock('../../services/cardService', () => {
  return {
    getCardsFromDeck: (_id: number | string) => {
      return Promise.resolve<Card[]>(MOCK_CARDS);
    },
  };
});

const MOCK_CARDS: Card[] = [
  {
    id: 1,
    question: 'What is the capital of France?',
    answer: 'Paris',
    hint: '',
  },
  {
    id: 2,
    question: 'What is the capital of Germany?',
    answer: 'Berlin',
    hint: '',
  },
  {
    id: 3,
    question: 'What is the capital of Italy?',
    answer: 'Rome',
    hint: '',
  },
];

describe('Card study component', () => {
  beforeEach(async () => {
    await waitFor(() => {
      render(
        <MemoryRouter initialEntries={['/decks/1/cards/study']}>
          <Route path="/decks/:deckId/cards/study">
            <CardStudy />
          </Route>
        </MemoryRouter>
      );
    });
  });

  const showAnswerAndGoToNextCard = () => {
    const button = screen.getByText('Show answer');
    fireEvent.click(button);
    fireEvent.click(screen.getByText('Next'));
  };

  it('should render question on initial', () => {
    expect(screen.getByText(MOCK_CARDS[0].question)).toBeInTheDocument();
  });

  it('should not show answer on initial', () => {
    expect(screen.queryByText(MOCK_CARDS[0].answer)).not.toBeInTheDocument();
  });

  it('should show answer on "Show answer" button click', () => {
    const button = screen.getByText('Show answer');

    fireEvent.click(button);

    expect(screen.getByText(MOCK_CARDS[0].answer)).toBeInTheDocument();
  });

  it('should show "Next" button after clicking "Show answer"', () => {
    const button = screen.getByText('Show answer');

    fireEvent.click(button);

    expect(screen.getByText('Next', { exact: false })).toBeInTheDocument();
  });

  //Since we initiate on first card, we should not be able to see the "Previous" button
  it('should apply "visibility:hidden" style to "Previous" button after first click on "Show answer"', () => {
    const button = screen.getByText('Show answer');

    fireEvent.click(button);

    expect(screen.getByText('Previous', { exact: false })).toHaveStyle(
      'visibility: hidden'
    );
  });

  it('should show "Previous" button on second card', () => {
    showAnswerAndGoToNextCard();

    fireEvent.click(screen.getByText('Show answer'));

    expect(screen.getByText('Previous', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Previous', { exact: false })).toHaveStyle(
      'visibility: visible'
    );
  });

  it('should not show "Next" button on last card of the card array', () => {
    for (let i = 0; i < MOCK_CARDS.length - 1; i++) {
      showAnswerAndGoToNextCard();
    }

    fireEvent.click(screen.getByText('Show answer'));

    expect(screen.getByText('Next', { exact: false })).toHaveStyle(
      'visibility: hidden'
    );
  });
});
