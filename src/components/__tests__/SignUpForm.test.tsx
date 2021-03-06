import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AlertContext } from '../../contexts/AlertContext';
import * as authService from '../../services/authService';
import { SignUpForm } from '../SignUpForm';
jest.mock('../../services/authService', () => {
  return {
    register: jest.fn(),
  };
});
const setAlert = jest.fn();
describe('Sign up form component', () => {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    spy = jest.spyOn(authService, 'register');
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
        <MemoryRouter>
          <SignUpForm />
        </MemoryRouter>
      </AlertContext.Provider>
    );
  });

  it('should render the form', () => {
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it('should call register function on submit', async () => {
    const name = 'John Doe';
    const username = 'johndoe';
    const password = '123456';
    const confirmPassword = '123456';

    userEvent.type(screen.getByLabelText('Name'), name);
    userEvent.type(screen.getByLabelText('Username'), username);
    userEvent.type(screen.getByLabelText('Password'), password);
    userEvent.type(screen.getByLabelText('Confirm password'), confirmPassword);

    userEvent.click(await screen.findByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        name,
        username,
        password,
        confirmPassword,
      });
    });
  });

  it('should show required errors on field when submitting with empty form', async () => {
    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findAllByText(/required/i)).toHaveLength(4);
  });

  it('should show password must match error on field when submitting with mismatching passwords', async () => {
    const name = 'John Doe';
    const username = 'johndoe';
    const password = '123456';
    const confirmPassword = '654321';

    userEvent.type(screen.getByLabelText('Name'), name);
    userEvent.type(screen.getByLabelText('Username'), username);
    userEvent.type(screen.getByLabelText('Password'), password);
    userEvent.type(screen.getByLabelText('Confirm password'), confirmPassword);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/must match/i)).toBeInTheDocument();
    });
  });

  it('should show password must be at least 6 characters error on field when submitting with short password', async () => {
    const name = 'John Doe';
    const username = 'johndoe';
    const password = '12345';
    const confirmPassword = '123456';

    userEvent.type(screen.getByLabelText('Name'), name);
    userEvent.type(screen.getByLabelText('Username'), username);
    userEvent.type(screen.getByLabelText('Password'), password);
    userEvent.type(screen.getByLabelText('Confirm password'), confirmPassword);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // error should have "password" and "at least 6 characters" with anything in between
    await waitFor(() => {
      expect(
        screen.getByText(/password.*at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('should show username must be at least 5 characters on field when submitting with short username', async () => {
    const name = 'John Doe';
    const username = 'john';
    const password = '123456';
    const confirmPassword = '123456';

    userEvent.type(screen.getByLabelText('Name'), name);
    userEvent.type(screen.getByLabelText('Username'), username);
    userEvent.type(screen.getByLabelText('Password'), password);
    userEvent.type(screen.getByLabelText('Confirm password'), confirmPassword);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // error should have "username" and "at least 5 characters" with anything in between
    await waitFor(() => {
      expect(
        screen.getByText(/username.*at least 5 characters/i)
      ).toBeInTheDocument();
    });
  });
});
