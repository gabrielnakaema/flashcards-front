import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { CardForm } from '../CardForm';
import * as cardService from '../../services/cardService';
import { AlertContext } from '../../contexts/AlertContext';

jest.mock('../../services/cardService', () => {
  return {
    createCards: jest.fn((deckId, newCards) => {
      return Promise.resolve();
    }),
    updateCard: jest.fn((newCard) => {
      return Promise.resolve();
    }),
  };
});

describe('card form component', () => {
  beforeEach(() => {
    const setAlert = jest.fn();
    render(
      <AlertContext.Provider
        value={{
          setAlert,
          alert: {
            message: '',
            type: 'success',
            duration: 0,
          },
        }}
      >
        <MemoryRouter initialEntries={['/decks/1/cards/add']}>
          <Route path="/decks/:deckId/cards/add">
            <CardForm />
          </Route>
        </MemoryRouter>
      </AlertContext.Provider>
    );
  });

  const INPUT_FIELDS = ['question', 'answer', 'hint'];

  it('should have correct number of input elements', () => {
    const inputFields = screen.getAllByRole('textbox');
    expect(inputFields.length).toBe(INPUT_FIELDS.length);
  });

  it('should have at least one input for each INPUT_FIELDS element', () => {
    INPUT_FIELDS.forEach((field) => {
      expect(screen.getByLabelText(new RegExp(field, 'i'))).toBeInTheDocument();
    });
  });

  it('should disable submit button after clicking submit on empty form', async () => {
    const submitButton = screen.getByRole('button', { name: /submit/i });
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should initialize component with a button with text "Blank card"', () => {
    expect(
      screen.getByRole('button', { name: /blank card/i })
    ).toBeInTheDocument();
  });

  it('should have a button to add a card', () => {
    expect(
      screen.getByRole('button', { name: /add card/i })
    ).toBeInTheDocument();
  });

  it('should add 2 buttons to the document after clicking "add card" button', async () => {
    const previousButtons = screen.getAllByRole('button');

    userEvent.click(screen.getByRole('button', { name: /add card/i }));

    const newButtons = await screen.findAllByRole('button');

    // 2 new buttons are: "Blank card" and the remove card button
    await waitFor(() => {
      expect(newButtons.length).toBe(previousButtons.length + 2);
    });
  });

  it('should disable "submit" button after clicking "add card" button', async () => {
    userEvent.click(screen.getByRole('button', { name: /add card/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });
  });

  it('should enable submit button after typing question and answer input fields', async () => {
    const questionInput = screen.getByLabelText(/question/i);
    const answerInput = screen.getByLabelText(/answer/i);
    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    }) as HTMLButtonElement;

    userEvent.type(questionInput, 'questionTest');
    userEvent.type(answerInput, 'answerTest');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call cardService createCards spy with correct values after clicking submit button', async () => {
    const spy = jest.spyOn(cardService, 'createCards');
    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    }) as HTMLButtonElement;

    const questionInput = screen.getByLabelText(/question/i);
    const answerInput = screen.getByLabelText(/answer/i);
    const hintInput = screen.getByLabelText(/hint/i);

    userEvent.type(questionInput, 'TestingQuestion');
    userEvent.type(answerInput, 'TestingAnswer');
    userEvent.type(hintInput, 'TestingHint');

    userEvent.click(submitButton);

    return await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('1', [
        {
          question: 'TestingQuestion',
          answer: 'TestingAnswer',
          hint: 'TestingHint',
        },
      ]);
    });
  });

  it('should call spy with two cards after clicking "add card" button and filling in form again', async () => {
    const spy = jest.spyOn(cardService, 'createCards');
    const addCardButton = screen.getByRole('button', {
      name: /add card/i,
    }) as HTMLButtonElement;
    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    }) as HTMLButtonElement;

    const questionInput = screen.getByLabelText(/question/i);
    const answerInput = screen.getByLabelText(/answer/i);
    const hintInput = screen.getByLabelText(/hint/i);

    userEvent.type(questionInput, 'TestingQ');
    userEvent.type(answerInput, 'TestingA');
    userEvent.type(hintInput, 'TestingH');

    userEvent.click(addCardButton);

    userEvent.type(questionInput, 'TestingQuestion2');
    userEvent.type(answerInput, 'TestingAnswer2');
    userEvent.type(hintInput, 'TestingHint2');

    userEvent.click(submitButton);

    return await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('1', [
        {
          question: 'TestingQ',
          answer: 'TestingA',
          hint: 'TestingH',
        },
        {
          question: 'TestingQuestion2',
          answer: 'TestingAnswer2',
          hint: 'TestingHint2',
        },
      ]);
    });
  });
});
