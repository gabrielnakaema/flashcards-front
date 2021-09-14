import { render, screen, waitFor } from '@testing-library/react';
import { DeckForm } from '../DeckForm';
import * as deckService from '../../services/deckService';
import userEvent from '@testing-library/user-event';

describe('Deck form component', () => {
  beforeEach(() => {
    render(<DeckForm />);
  });

  it('should render input fields', () => {
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(2);
  });

  it('should render correct text on input fields', () => {
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should show required errors on empty submission', async () => {
    const button = screen.getByRole('button');

    button.click();

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('should not call createDeck when submitting empty values', async () => {
    const createDeckSpy = jest.spyOn(deckService, 'createDeck');
    const button = screen.getByRole('button');

    button.click();

    await waitFor(() => {
      expect(createDeckSpy).not.toHaveBeenCalled();
    });
  });

  it('should call createDeck from deckService when submitting with non empty values', async () => {
    const createDeckSpy = jest.spyOn(deckService, 'createDeck');
    const button = screen.getByRole('button');
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    userEvent.type(titleInput, 'test title');
    userEvent.type(descriptionInput, 'test description');
    button.click();

    await waitFor(() => {
      expect(createDeckSpy).toHaveBeenCalledTimes(1);
      expect(createDeckSpy).toHaveBeenCalledWith({
        title: 'test title',
        description: 'test description',
      });
    });
  });
});
