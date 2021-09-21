import { useState, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { FieldArray, getIn, Formik, Form } from 'formik';
import * as Yup from 'yup';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Button, IconButton, TextField, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { AlertContext } from '../contexts/AlertContext';
import { createCards } from '../services/cardService';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

interface NewCard {
  question: string;
  answer: string;
  hint?: string;
}

const validationSchema = Yup.object().shape({
  cards: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().required('Question is required'),
      answer: Yup.string().required('Answer is required'),
      hint: Yup.string(),
    })
  ),
});

const initialCard: NewCard = { question: '', answer: '', hint: '' };

export const CardForm = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { deckId } = useParams<{ deckId: string }>();
  const { setAlert } = useContext(AlertContext);
  const accessIndexes = {
    question: `cards[${currentIndex}].question`,
    answer: `cards[${currentIndex}].answer`,
    hint: `cards[${currentIndex}].hint`,
  };

  const changeIndex = (index: number) => {
    if (index === currentIndex) {
      return;
    }
    setCurrentIndex(index);
  };

  const handleAfterRemove = (index: number) => {
    if (index <= currentIndex) {
      changeIndex(currentIndex - 1);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: {
          xs: '450px',
          md: '720px',
        },
        margin: '1rem auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">Add cards</Typography>
      <Formik
        initialValues={{
          cards: [initialCard],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createCards(deckId, values.cards);
            changeIndex(0);
            resetForm();
            setAlert('Card(s) added to deck!', 'success', 3000);
          } catch (error) {
            setAlert(extractErrorMessage(error), 'error', 3000);
          }
        }}
      >
        {(formik) => (
          <Form autoComplete="off">
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
              }}
            >
              <FieldArray name="cards">
                {(arrayHelpers) => (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flex: '0 0 50%',
                        flexDirection: 'column',
                        padding: '1rem',
                      }}
                    >
                      <TextField
                        id="question-field"
                        name={accessIndexes.question}
                        type="text"
                        label="Question"
                        value={formik.values.cards[currentIndex].question}
                        onChange={formik.handleChange}
                        error={
                          getIn(formik.touched, accessIndexes.question) &&
                          !!getIn(formik.errors, accessIndexes.question)
                        }
                        helperText={
                          getIn(formik.touched, accessIndexes.question) &&
                          getIn(formik.errors, accessIndexes.question)
                        }
                        sx={{ marginBottom: '1rem' }}
                      />
                      <TextField
                        id="answer-field"
                        name={accessIndexes.answer}
                        type="text"
                        label="Answer"
                        value={formik.values.cards[currentIndex].answer}
                        onChange={formik.handleChange}
                        error={
                          getIn(formik.touched, accessIndexes.answer) &&
                          !!getIn(formik.errors, accessIndexes.answer)
                        }
                        helperText={
                          getIn(formik.touched, accessIndexes.answer) &&
                          getIn(formik.errors, accessIndexes.answer)
                        }
                        sx={{ marginBottom: '1rem' }}
                      />
                      <TextField
                        id="hint-field"
                        name={accessIndexes.hint}
                        type="text"
                        label="Hint"
                        value={formik.values.cards[currentIndex].hint}
                        onChange={formik.handleChange}
                        sx={{ marginBottom: '1rem' }}
                      />
                      <Box>
                        <Button
                          color="error"
                          component={RouterLink}
                          to={`/decks/${deckId}`}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!formik.isValid}
                          data-testid="submit-button"
                          sx={{ marginLeft: '1rem' }}
                        >
                          Submit all cards
                        </Button>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '0 0 50%',
                        padding: '1rem',
                      }}
                    >
                      <Button
                        type="button"
                        onClick={() => {
                          arrayHelpers.push(initialCard);
                          setCurrentIndex(formik.values.cards.length);
                        }}
                        startIcon={<AddIcon />}
                        sx={{ marginBottom: '0.5rem' }}
                      >
                        Add card
                      </Button>
                      {formik.values.cards.map((card, index) => (
                        <CardToBeAdded
                          key={card.question + index}
                          question={card.question}
                          selectIndex={() => changeIndex(index)}
                          isValid={
                            !Boolean(
                              formik.errors.cards && formik.errors.cards[index]
                            )
                          }
                          isSelected={index === currentIndex}
                          removeCard={() => {
                            if (formik.values.cards.length === 1) {
                              return;
                            }
                            arrayHelpers.remove(index);
                            handleAfterRemove(index);
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </FieldArray>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

interface CardToBeAddedProps {
  question: string;
  selectIndex: () => void;
  isValid: boolean;
  isSelected: boolean;
  removeCard: () => void;
}

const CardToBeAdded = (props: CardToBeAddedProps) => {
  return (
    <Box sx={{ marginBottom: '1rem', width: '100%', display: 'flex' }}>
      <Button
        onClick={props.selectIndex}
        type="button"
        variant="outlined"
        color={props.isValid ? 'primary' : 'error'}
        startIcon={props.isSelected && <ArrowRightIcon />}
        sx={{ flex: '1 0 50%' }}
      >
        <Typography
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            textTransform: 'none',
          }}
        >
          {props.question ? props.question : 'Blank card'}
        </Typography>
      </Button>
      <IconButton
        sx={{ marginLeft: 'auto', opacity: '50%' }}
        onClick={props.removeCard}
        aria-label="remove card"
      >
        <DeleteOutlineIcon />
      </IconButton>
    </Box>
  );
};
