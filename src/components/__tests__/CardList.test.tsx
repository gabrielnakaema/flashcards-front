import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Card } from '../../types';
import { CardList } from '../CardList';
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
    hint: 'Abcccdefg',
  },
  {
    id: 2,
    question: 'What is the capital of Germany?',
    answer: 'Berlin',
    hint: 'HHHGSDSD',
  },
  {
    id: 3,
    question: 'What is the capital of Italy?',
    answer: 'Rome',
    hint: 'ASASSDAD',
  },
];

const CARD_TABLE_HEADERS = ['Question', 'Answer', 'Hint'];

describe('Card table component', () => {
  beforeEach(async () => {
    await waitFor(() => {
      render(
        <MemoryRouter initialEntries={['/decks/1/cards/list']}>
          <Route path="/decks/:deckId/cards/list">
            <CardList />
          </Route>
        </MemoryRouter>
      );
    });
  });

  it('should render', () => {
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct headers', () => {
    CARD_TABLE_HEADERS.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('should render correct number of rows', () => {
    // header row counts towards number of rows, that's why there is a + 1
    expect(screen.getAllByRole('row')).toHaveLength(MOCK_CARDS.length + 1);
  });

  it('should render first row correctly', () => {
    expect(screen.getByText(MOCK_CARDS[0].question)).toBeInTheDocument();
    expect(screen.getByText(MOCK_CARDS[0].answer)).toBeInTheDocument();
    expect(screen.getByText(MOCK_CARDS[0].hint)).toBeInTheDocument();
  });
});
