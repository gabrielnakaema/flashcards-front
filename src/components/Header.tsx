import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Link } from '@material-ui/core';
import { AuthContext } from '../contexts/AuthContext';

export const Header = () => {
  const auth = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          <Link component={RouterLink} to="/" color="inherit">
            Flashcards
          </Link>
        </Typography>
        <div style={{ marginLeft: 'auto' }}>
          {auth.user ? (
            <Button color="inherit" onClick={auth.logout}>
              Log out
            </Button>
          ) : (
            <>
              <Link
                component={RouterLink}
                to="/signin"
                color="inherit"
                style={{ textDecoration: 'none' }}
              >
                Sign in
              </Link>
              <Link
                component={RouterLink}
                to="/signup"
                color="inherit"
                style={{ textDecoration: 'none' }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
