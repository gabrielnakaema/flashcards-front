import { useState, useEffect, useContext, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CloseIcon from '@material-ui/icons/Close';
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
      <>
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
              <TableCell>Actions</TableCell>
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
      </>
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
        <Button onClick={props.closeEdit} aria-label="close edit form button">
          <CloseIcon />
        </Button>
      ) : (
        <Button onClick={props.openEdit} aria-label="open edit form button">
          <EditIcon />
        </Button>
      )}
      <Button onClick={props.delete} aria-label="delete card button">
        <DeleteOutlineIcon />
      </Button>
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
            variant="outlined"
            value={formik.values.question || ''}
            onChange={formik.handleChange}
            required
          />
          <TextField
            id="edit-card-answer"
            name="answer"
            label="Answer"
            variant="outlined"
            value={formik.values.answer || ''}
            onChange={formik.handleChange}
            required
          />
          <TextField
            id="edit-card-hint"
            name="hint"
            label="Hint"
            value={formik.values.hint || ''}
            onChange={formik.handleChange}
            variant="outlined"
          />
          <Button type="submit">Save</Button>
        </Form>
      )}
    </Formik>
  );
};
