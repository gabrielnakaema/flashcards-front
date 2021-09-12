import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as authService from '../../services/authService';
import { SignUpForm } from '../SignUpForm';

describe('Sign up form component', () => {
  beforeEach(() => {
    render(<SignUpForm />);
  });

  it('should render the form', () => {
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should call register function on submit', () => {
    const name = 'John Doe';
    const username = 'johndoe';
    const password = '123456';
    const confirmPassword = '123456';
    const spy = jest.spyOn(authService, 'register');

    userEvent.type(screen.getByLabelText('Name'), name);
    userEvent.type(screen.getByLabelText('Username'), username);
    userEvent.type(screen.getByLabelText('Password'), password);
    userEvent.type(screen.getByLabelText('Confirm password'), confirmPassword);

    userEvent.click(screen.getByText('Submit'));

    expect(spy).toHaveBeenCalledWith({
      name,
      username,
      password,
      confirmPassword,
    });
  });
});
