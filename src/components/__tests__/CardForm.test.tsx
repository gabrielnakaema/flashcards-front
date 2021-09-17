import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { CardForm } from '../CardForm';
import * as cardService from '../../services/cardService';

describe('card form component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/decks/1/cards/add']}>
        <Route path="/decks/:deckId/cards/add">
          <CardForm />
        </Route>
      </MemoryRouter>
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

  it('should initialize component with disabled submit button', () => {
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
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

  it('should add one button with text "Blank card" to the document after clicking "add card" button', () => {
    const previousButtons = screen.getAllByRole('button');
    userEvent.click(screen.getByRole('button', { name: /add card/i }));
    const newButtons = screen.getAllByRole('button');
    expect(newButtons.length).toBe(previousButtons.length + 1);
    const blankCardButtons = screen.getAllByRole('button', {
      name: /blank card/i,
    });
    expect(blankCardButtons.length).toBe(2);
  });

  it('should disable "submit" button after clicking "add card" button', () => {
    userEvent.click(screen.getByRole('button', { name: /add card/i }));
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should enable submit button after typing question and answer input fields', async () => {
    const questionInput = screen.getByLabelText(/question/i);
    const answerInput = screen.getByLabelText(/answer/i);
    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    }) as HTMLButtonElement;

    expect(submitButton).toBeTruthy();
    expect(submitButton.disabled).toBe(true);

    userEvent.type(questionInput, 'questionTest');
    userEvent.type(answerInput, 'answerTest');

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
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

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });

    userEvent.click(submitButton);

    await waitFor(() => {
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

    userEvent.type(questionInput, 'TestingQuestion');
    userEvent.type(answerInput, 'TestingAnswer');
    userEvent.type(hintInput, 'TestingHint');

    userEvent.click(addCardButton);

    const questionInput2 = screen.getByLabelText(/question/i);
    const answerInput2 = screen.getByLabelText(/answer/i);
    const hintInput2 = screen.getByLabelText(/hint/i);

    userEvent.type(questionInput2, 'TestingQuestion2');
    userEvent.type(answerInput2, 'TestingAnswer2');
    userEvent.type(hintInput2, 'TestingHint2');

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('1', [
        {
          question: 'TestingQuestion',
          answer: 'TestingAnswer',
          hint: 'TestingHint',
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