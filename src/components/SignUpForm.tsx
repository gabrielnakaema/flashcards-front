import { useContext } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../contexts/AlertContext';
import { register } from '../services/authService';
import { useHistory } from 'react-router';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const SignUpForm = () => {
  const { setAlert } = useContext(AlertContext);
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      username: Yup.string()
        .required('Username is required')
        .min(5, 'Username must be at least 5 characters'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      formik.setErrors(await formik.validateForm());
      if (formik.isValid) {
        const newUser = {
          name: values.name,
          username: values.username,
          password: values.password,
          confirmPassword: values.confirmPassword,
        };
        try {
          await register(newUser);
          setAlert(
            'User created successfully, please sign in',
            'success',
            3000
          );
          history.push('/signin');
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
      <Typography variant="h6">Sign up</Typography>
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
            id="name-field"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={handleChange}
            error={formik.touched.name && formik.errors.name ? true : false}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            id="username-field"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={handleChange}
            error={
              formik.touched.username && formik.errors.username ? true : false
            }
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            id="password-field"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={handleChange}
            error={
              formik.touched.password && formik.errors.password ? true : false
            }
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            id="confirm-password-field"
            name="confirmPassword"
            label="Confirm password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={handleChange}
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? true
                : false
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />
          <Button type="submit" fullWidth variant="contained">
            Sign up
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
