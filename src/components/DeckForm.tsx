import { useContext } from 'react';
import { Box, Button, TextField } from '@mui/material';
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
          id="title-field"
          name="title"
          label="Title"
          value={formik.values.title}
          onChange={handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          sx={{ marginBottom: '1rem' }}
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
          sx={{ marginBottom: '1rem' }}
        />
        <Button type="submit">Submit</Button>
      </Box>
    </form>
  );
};
