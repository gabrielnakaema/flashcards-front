import { Button, TextField } from '@material-ui/core';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useTextField } from '../hooks/useTextField';

export const SignInForm = () => {
  const usernameField = useTextField('');
  const passwordField = useTextField('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(usernameField.value, passwordField.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="username-field"
        label="Username"
        variant="outlined"
        value={usernameField.value}
        onChange={usernameField.onChange}
      />
      <TextField
        id="password-field"
        label="Password"
        variant="outlined"
        value={passwordField.value}
        onChange={passwordField.onChange}
        type="password"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
