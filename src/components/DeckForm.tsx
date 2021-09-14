import { Button, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createDeck } from '../services/deckService';

export const DeckForm = () => {
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
        await createDeck(newDeck);
        formik.resetForm();
      }
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldTouched(event.target.name);
    formik.handleChange(event);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        id="title-field"
        name="title"
        label="Title"
        variant="outlined"
        value={formik.values.title}
        onChange={handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <TextField
        id="description-field"
        name="description"
        label="Description"
        variant="outlined"
        value={formik.values.description}
        onChange={handleChange}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
