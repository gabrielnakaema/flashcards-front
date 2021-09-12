import { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { CardStudy } from './components/CardStudy';
import { CardList } from './components/CardList';
import { DeckDetail } from './components/DeckDetail';
import { DeckTable } from './components/DeckTable';
import { SignInForm } from './components/SignInForm';
import { SignUpForm } from './components/SignUpForm';
import { Header } from './components/Header';

function App() {
  const auth = useContext(AuthContext);
  return (
    <Router>
      <Header username={auth.user?.username} logout={auth.logout} />
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
        <Route path="/signin">
          {auth.isAuthenticated ? <Redirect to="/" /> : <SignInForm />}
        </Route>
        <Route path="/signup">
          {auth.isAuthenticated ? <Redirect to="/" /> : <SignUpForm />}
        </Route>
        <Route path="/">
          <DeckTable />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
