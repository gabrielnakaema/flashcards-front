import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { DeckTable } from '../DeckTable';
import { mockDecks } from '../../utils/tests/mock-decks';
import userEvent from '@testing-library/user-event';
jest.mock('../../services/deckService', () => {
  return {
    getDecks: () => {
      return Promise.resolve(mockDecks);
    },
  };
});

const HEADERS = ['ID', 'Title', 'Description'];

describe('Deck Table component', () => {
  let history: MemoryHistory;
  beforeEach(async () => {
    history = createMemoryHistory();
    await waitFor(() => {
      render(
        <Router history={history}>
          <DeckTable />
        </Router>
      );
    });
  });

  it('should render a table element', async () => {
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render a table with correct headers', async () => {
    const tableHeaders = screen.getAllByRole('columnheader');
    expect(tableHeaders).toHaveLength(HEADERS.length);
    HEADERS.forEach((header, index) => {
      expect(tableHeaders[index]).toHaveTextContent(header);
    });
  });

  it('should have rows inside tbody with mockDecks length', async () => {
    const tbody = await screen.findByTestId('deck-table-body');
    expect(tbody.children).toHaveLength(mockDecks.length);
  });

  it('should render correct information in row', () => {
    const tbody = screen.getByTestId('deck-table-body');
    const rows = tbody.children;

    const row = rows[0];
    expect(row.children).toHaveLength(HEADERS.length);
    expect(row.children[0]).toHaveTextContent(mockDecks[0].id.toString());
    expect(row.children[1]).toHaveTextContent(mockDecks[0].title);
    expect(row.children[2]).toHaveTextContent(mockDecks[0].description);
  });

  it('should change history location pathname to /decks/1 on first row', async () => {
    const tbody = screen.getByTestId('deck-table-body');
    const rows = tbody.children;
    const row = rows[0];
    userEvent.click(row);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe(`/decks/${mockDecks[0].id}`);
  });

  it('should change history location pathname to /decks/2 on second row', () => {
    const tbody = screen.getByTestId('deck-table-body');
    const rows = tbody.children;
    const row = rows[1];
    userEvent.click(row);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe(`/decks/${mockDecks[1].id}`);
  });
});
