import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthContext } from '../../contexts/AuthContext';
import { SignInForm } from '../SignInForm';

describe('SignInForm', () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    render(
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
        <SignInForm />
      </AuthContext.Provider>
    );
  });

  it('should render the form', () => {
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  it('should call login function on submit', () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/submit/i);

    userEvent.type(usernameInput, 'test');
    userEvent.type(passwordInput, 'test');
    userEvent.click(submitButton);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith('test', 'test');
  });
});
