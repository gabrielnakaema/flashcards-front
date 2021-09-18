import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { DeckDetail } from '../DeckDetail';
import { DeckDetails } from '../../types';
jest.mock('../../services/deckService', () => {
  return {
    getDeckDetailById: (_id: number | string) => {
      return Promise.resolve<DeckDetails>(DECK_DETAIL);
    },
  };
});

const DECK_DETAIL: DeckDetails = {
  id: 1,
  title: 'TestingDeck1',
  description: 'TestingDescription1',
  cardCount: 40,
  user: {
    username: 'testingUsername1',
    name: 'testingName1',
  },
};

describe('Deck detail component', () => {
  beforeEach(async () => {
    await waitFor(() => {
      render(
        <MemoryRouter initialEntries={['/decks/1']}>
          <Route path="/decks/:deckId">
            <DeckDetail />
          </Route>
        </MemoryRouter>
      );
    });
  });

  it('should render', async () => {
    expect(await screen.findByTestId('deck-detail')).toBeInTheDocument();
  });

  it('should display deck information', () => {
    expect(
      screen.getByText(DECK_DETAIL.title, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(DECK_DETAIL.description, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(DECK_DETAIL.cardCount, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(DECK_DETAIL.user.username, { exact: false })
    ).toBeInTheDocument();
  });

  it('should have a go back link', () => {
    // expects to find the back link at the top of the component, that's why it is the first element
    const links = screen.getAllByRole('link');

    expect(links[0]).toBeInTheDocument();
    expect(links[0]).toHaveAttribute('href', '/');
  });
});
