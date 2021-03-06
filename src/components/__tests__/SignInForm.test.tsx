import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AlertContext } from '../../contexts/AlertContext';
import { AuthContext } from '../../contexts/AuthContext';
import { SignInForm } from '../SignInForm';

const setAlert = jest.fn();
describe('SignInForm', () => {
  let mockSignIn: jest.Mock;

  beforeEach(() => {
    mockSignIn = jest.fn();
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
        <AuthContext.Provider
          value={{
            login: mockSignIn,
            isAuthenticated: false,
            user: { username: 'test' },
            logout: () => {
              return;
            },
          }}
        >
          <MemoryRouter>
            <SignInForm />
          </MemoryRouter>
        </AuthContext.Provider>
      </AlertContext.Provider>
    );
  });

  it('should render the form', () => {
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('should call login function on submit', async () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    userEvent.type(usernameInput, 'testusername');
    userEvent.type(passwordInput, 'testpassword');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('testusername', 'testpassword');
    });
  });

  it('should show error for at least 6 character password on submit form with short password', async () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    userEvent.type(usernameInput, 'testusername');
    userEvent.type(passwordInput, 'test');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password.*at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });
});
