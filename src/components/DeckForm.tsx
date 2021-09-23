import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../contexts/AlertContext';
import { createDeck } from '../services/deckService';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const DeckForm = () => {
  const { setAlert } = useContext(AlertContext);
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      formik.setErrors(await formik.validateForm());
      if (formik.isValid) {
        const newDeck = {
          title: values.title,
          description: values.description,
        };
        try {
          const receivedDeck = await createDeck(newDeck);
          if (receivedDeck) {
            setAlert(
              `Deck with title ${receivedDeck.title} created successfully`,
              'success',
              3000
            );
          }
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
          xs: '450px',
        },
        margin: {
          xs: '1rem',
          sm: '1rem auto',
        },
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">Create deck</Typography>
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
            id="title-field"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            id="description-field"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: {
                xs: 'column-reverse',
                sm: 'row',
              },
            }}
          >
            <Button type="button" component={RouterLink} to="/" color="error">
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{
                marginLeft: {
                  xs: 0,
                  sm: '1.5rem',
                },
                flex: '1 0 auto',
              }}
              variant="contained"
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
