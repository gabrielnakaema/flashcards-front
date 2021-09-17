import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Card } from '../../types';
import { CardList } from '../CardList';
import * as cardService from '../../services/cardService';
import userEvent from '@testing-library/user-event';
import { AlertProvider } from '../../contexts/AlertContext';
jest.mock('../../services/cardService', () => {
  return {
    getCardsFromDeck: (_id: number | string) => {
      return Promise.resolve<Card[]>(MOCK_CARDS);
    },
    updateCard: jest.fn(),
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

const CARD_TABLE_HEADERS = ['Question', 'Answer', 'Hint', 'Actions'];

describe('Card table component', () => {
  beforeEach(async () => {
    await waitFor(() => {
      render(
        <AlertProvider>
          <MemoryRouter initialEntries={['/decks/1/cards/list']}>
            <Route path="/decks/:deckId/cards/list">
              <CardList />
            </Route>
          </MemoryRouter>
        </AlertProvider>
      );
    });
  });

  it('should render', () => {
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct headers', () => {
    CARD_TABLE_HEADERS.forEach((header) => {
      expect(screen.getByText(new RegExp(header, 'i'))).toBeInTheDocument();
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

  it('should render buttons to edit and delete card', () => {
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(editButtons).toHaveLength(MOCK_CARDS.length);
    expect(deleteButtons).toHaveLength(MOCK_CARDS.length);
  });

  it('should not have "textbox" elements on initialization', () => {
    const inputFields = screen.queryAllByRole('textbox');
    expect(inputFields).toHaveLength(0);
  });

  it('should show 3 input fields and a button with text "Save" after clicking any edit button', () => {
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    editButtons[0].click();
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should not call updateCard spy after clicking "Save" with the same initial data', () => {
    const updateCardSpy = jest.spyOn(cardService, 'updateCard');
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    editButtons[0].click();

    const saveButton = screen.getByRole('button', { name: /save/i });
    saveButton.click();

    expect(updateCardSpy).not.toHaveBeenCalled();
  });

  it('should call spy with correct arguments after editing one input field', async () => {
    const updateCardSpy = jest.spyOn(cardService, 'updateCard');
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    userEvent.click(editButtons[0]);

    const questionInputField = screen.getByRole('textbox', {
      name: /question/i,
    });
    userEvent.clear(questionInputField);
    userEvent.type(questionInputField, 'new question');
    expect(questionInputField).toHaveValue('new question');

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(updateCardSpy).toHaveBeenCalled();
      expect(updateCardSpy).toHaveBeenCalledWith('1', {
        id: MOCK_CARDS[0].id,
        question: 'new question',
        answer: MOCK_CARDS[0].answer,
        hint: MOCK_CARDS[0].hint,
      });
    });
  });
});
