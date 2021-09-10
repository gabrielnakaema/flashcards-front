import { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { getDecks } from "../services/deckService";
import { Deck } from "../types";

export const DeckTable = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getDecks();
      setDecks(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody data-testid="deck-table-body">
          {decks
            ? decks.map((deck) => (
                <TableRow key={deck.id}>
                  <TableCell>{deck.id}</TableCell>
                  <TableCell>{deck.title}</TableCell>
                  <TableCell>{deck.description}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};
