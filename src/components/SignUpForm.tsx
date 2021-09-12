import { Button, TextField } from '@material-ui/core';
import { useTextField } from '../hooks/useTextField';
import { register } from '../services/authService';

export const SignUpForm = () => {
  const nameField = useTextField('');
  const usernameField = useTextField('');
  const passwordField = useTextField('');
  const confirmPasswordField = useTextField('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      name: nameField.value,
      username: usernameField.value,
      password: passwordField.value,
      confirmPassword: confirmPasswordField.value,
    };
    register(newUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="name-field"
        label="Name"
        variant="outlined"
        value={nameField.value}
        onChange={nameField.onChange}
      />
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
      <TextField
        id="confirm-password-field"
        label="Confirm password"
        variant="outlined"
        value={confirmPasswordField.value}
        onChange={confirmPasswordField.onChange}
        type="password"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
