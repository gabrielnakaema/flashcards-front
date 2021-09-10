import { AppBar, Toolbar, Link, Typography } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Link as RouterLink,
  Switch,
  Route,
} from 'react-router-dom';
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
        <Route path="/">
          <DeckTable />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
