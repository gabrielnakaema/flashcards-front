import { useState, useEffect, useContext, Fragment } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import {
  getCardsFromDeck,
  updateCard,
  deleteCardFromDeck,
} from '../services/cardService';
import { AlertContext } from '../contexts/AlertContext';
import { Card } from '../types';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

export const CardList = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const { setAlert } = useContext(AlertContext);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [deletingCardId, setDeletingCardId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const cards = await getCardsFromDeck(deckId);
        setCards(cards);
      } catch (error) {
        setAlert(extractErrorMessage(error), 'error', 3000);
      }
    }
    fetchData();
  }, [deckId, setAlert]);

  const openDeleteDialog = (id: number) => {
    setIsDialogOpen(true);
    setDeletingCardId(id);
  };

  const deleteCard = async () => {
    if (deletingCardId !== null) {
      try {
        await deleteCardFromDeck(deckId, deletingCardId);
        setIsDialogOpen(false);
        setDeletingCardId(null);
        setCards(cards.filter((card) => card.id !== deletingCardId));
      } catch (error) {
        setAlert(extractErrorMessage(error), 'error', 3000);
      }
    }
  };

  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setDeletingCardId(null);
  };

  const handleEditCard = async (card: Card) => {
    try {
      const updatedCard = await updateCard(deckId, card);
      setCards(
        cards.map((c) => {
          if (c.id === updatedCard.id) {
            return updatedCard;
          } else {
            return c;
          }
        })
      );
      setEditingCardIndex(null);
    } catch (error) {
      setAlert(extractErrorMessage(error), 'error', 3000);
    }
  };

  if (cards.length === 0) {
    return <div>Loading...</div>;
  } else {
    return (
      <Box
        sx={{
          margin: {
            xs: '1rem 0.5rem',
            sm: '1rem 2rem',
            md: '1rem 4rem',
          },
        }}
      >
        <Button
          component={RouterLink}
          to={`/decks/${deckId}`}
          style={{ textDecoration: 'none', color: '#333' }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Paper>
          <RemoveCardDialog
            open={isDialogOpen}
            onClose={closeDeleteDialog}
            onConfirm={deleteCard}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell>Answer</TableCell>
                <TableCell>Hint</TableCell>
                <TableCell sx={{ paddingLeft: '2rem', width: '5rem' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cards.map((card, index) => (
                <Fragment key={card.id}>
                  <TableRow>
                    <TableCell>{card.question}</TableCell>
                    <TableCell>{card.answer}</TableCell>
                    <TableCell>{card.hint}</TableCell>
                    <TableCell>
                      <CardRowActions
                        openEdit={() => setEditingCardIndex(index)}
                        closeEdit={() => setEditingCardIndex(null)}
                        delete={() => openDeleteDialog(card.id)}
                        isEditing={index === editingCardIndex}
                      />
                    </TableCell>
                  </TableRow>
                  {editingCardIndex !== null && editingCardIndex === index && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography
                          sx={{ marginBottom: '1rem' }}
                          variant="body2"
                        >
                          Editing card {index + 1}
                        </Typography>
                        <EditCardForm
                          card={card}
                          onSubmit={handleEditCard}
                          closeForm={() => setEditingCardIndex(null)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    );
  }
};

interface RemoveCardDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const RemoveCardDialog = (props: RemoveCardDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Remove card</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove this card?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onConfirm} color="secondary">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface CardRowActionsProps {
  openEdit: () => void;
  closeEdit: () => void;
  delete: () => void;
  isEditing: boolean;
}

const CardRowActions = (props: CardRowActionsProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {props.isEditing ? (
        <IconButton
          onClick={props.closeEdit}
          aria-label="close edit form button"
        >
          <CloseIcon />
        </IconButton>
      ) : (
        <IconButton onClick={props.openEdit} aria-label="open edit form button">
          <EditIcon />
        </IconButton>
      )}
      <IconButton onClick={props.delete} aria-label="delete card button">
        <DeleteOutlineIcon />
      </IconButton>
    </div>
  );
};

interface EditCardFormProps {
  card: Card;
  onSubmit: (card: Card) => void;
  closeForm: () => void;
}

const EditCardForm = (props: EditCardFormProps) => {
  return (
    <Formik
      onSubmit={(values) => {
        if (
          values.question !== props.card.question ||
          values.answer !== props.card.answer ||
          values.hint !== props.card.hint
        ) {
          props.onSubmit({
            id: props.card.id,
            question: values.question,
            answer: values.answer,
            hint: values.hint,
          });
        } else {
          props.closeForm();
        }
      }}
      initialValues={{
        question: props.card.question,
        answer: props.card.answer,
        hint: props.card.hint,
      }}
    >
      {(formik) => (
        <Form>
          <TextField
            id="edit-card-question"
            name="question"
            label="Question"
            value={formik.values.question || ''}
            onChange={formik.handleChange}
            required
            sx={{ marginRight: '1rem' }}
          />
          <TextField
            id="edit-card-answer"
            name="answer"
            label="Answer"
            value={formik.values.answer || ''}
            onChange={formik.handleChange}
            required
            sx={{ marginRight: '1rem' }}
          />
          <TextField
            id="edit-card-hint"
            name="hint"
            label="Hint"
            value={formik.values.hint || ''}
            onChange={formik.handleChange}
            sx={{ marginRight: '1rem' }}
          />
          <Button type="submit" sx={{ marginTop: '0.5rem' }}>
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};
