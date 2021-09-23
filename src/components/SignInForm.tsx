import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
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
    <Box
      sx={{
        maxWidth: {
          xs: '375px',
        },
        margin: {
          xs: '1rem',
          sm: '1rem auto',
        },
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">Sign in to your account</Typography>
      <form onSubmit={formik.handleSubmit}>
        <Stack
          sx={{
            marginTop: '1rem',
            border: '1px solid',
            borderColor: '#eee',
            padding: '1.5rem',
            borderRadius: '5px',
            backgroundColor: '#fefefe',
          }}
          spacing="1.5rem"
        >
          <TextField
            id="username-field"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            sx={{ backgroundColor: '#fff' }}
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
            sx={{ backgroundColor: '#fff' }}
          />
          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
      <Typography sx={{ marginTop: '1.5rem' }}>
        Don't have an account? <RouterLink to="/signup">Create one!</RouterLink>
      </Typography>
    </Box>
  );
};
