import { Box, Button, TextField } from '@mui/material';
import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';
import { AlertContext } from '../contexts/AlertContext';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const SignInForm = () => {
  const { login } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Username is required')
        .min(5, 'Username must be at least 5 characters'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: async (values) => {
      formik.setErrors(await formik.validateForm());
      if (formik.isValid) {
        try {
          login(values.username, values.password);
          setAlert(`Signed in as ${values.username}`, 'success', 3000);
        } catch (error: any) {
          setAlert(extractErrorMessage(error), 'error', 3000);
        }
      }
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldTouched(event.target.name);
    formik.handleChange(event);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          maxWidth: {
            xs: '450px',
          },
          margin: {
            xs: '1rem',
            sm: '1rem auto',
          },
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          id="username-field"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          sx={{ marginBottom: '1rem' }}
        />
        <TextField
          id="password-field"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ marginBottom: '1rem' }}
        />
        <Button type="submit">Submit</Button>
      </Box>
    </form>
  );
};
