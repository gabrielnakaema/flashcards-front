import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';

describe('Header component', () => {
  it('should render "Flashcards" link that goes to "/"', () => {
    render(
      <MemoryRouter>
        <Header
          username={undefined}
          logout={() => {
            return;
          }}
        />
      </MemoryRouter>
    );
    const flashcardsLink = screen.getAllByRole('link')[0];

    expect(flashcardsLink).toHaveAttribute('href', '/');
    expect(flashcardsLink).toHaveTextContent('Flashcards');
  });

  describe('without logged in user', () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <Header
            username={undefined}
            logout={() => {
              return;
            }}
          />
        </MemoryRouter>
      );
    });

    it('should render "Sign in" "Sign up" links', () => {
      expect(screen.getByText('Sign in')).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    it('should contain links to sign in and sign up', () => {
      const links = screen.getAllByRole('link');

      expect(
        links.some((link) => {
          if (
            link.textContent &&
            link.textContent.toLowerCase().includes('sign in')
          ) {
            if (link.getAttribute('href') === '/signin') {
              return true;
            }
          }
          return false;
        })
      ).toBe(true);
      expect(
        links.some((link) => {
          if (
            link.textContent &&
            link.textContent.toLowerCase().includes('sign up')
          ) {
            if (link.getAttribute('href') === '/signup') {
              return true;
            }
          }
          return false;
        })
      ).toBe(true);
    });
  });

  describe('logged in user', () => {
    const logoutFn = jest.fn();

    beforeEach(() => {
      render(
        <MemoryRouter>
          <Header username="testUser" logout={logoutFn} />
        </MemoryRouter>
      );
    });

    it('should render "Log out"', () => {
      expect(screen.getByText('Log out')).toBeInTheDocument();
    });

    it('should call logout on click "Log out"', () => {
      const logoutButton = screen.getByText('Log out');

      logoutButton.click();

      expect(logoutFn).toHaveBeenCalled();
    });

    it('should not contain "Sign in" or "Sign up"', () => {
      expect(screen.queryByText('Sign in')).toBeNull();
      expect(screen.queryByText('Sign up')).toBeNull();
    });
  });
});
