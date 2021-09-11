import { AppBar, Toolbar, Link, Typography } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Link as RouterLink,
  Switch,
  Route,
} from 'react-router-dom';
import { CardStudy } from './components/CardStudy';
import { CardList } from './components/CardList';
import { DeckDetail } from './components/DeckDetail';
import { DeckTable } from './components/DeckTable';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              style={{ textDecoration: 'none' }}
            >
              Flashcards
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/decks/:deckId/cards/study">
          <CardStudy />
        </Route>
        <Route path="/decks/:deckId/cards/list">
          <CardList />
        </Route>
        <Route path="/decks/:deckId">
          <DeckDetail />
        </Route>
        <Route path="/">
          <DeckTable />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
