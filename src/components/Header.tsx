import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Link } from '@mui/material';

interface HeaderProps {
  logout: () => void;
  username: string | undefined;
}

export const Header = (props: HeaderProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          style={{ textDecoration: 'none' }}
        >
          <Typography variant="h6" component="h1" color="inherit">
            Flashcards
          </Typography>
        </Link>
        <div style={{ marginLeft: 'auto' }}>
          {props.username ? (
            <Button color="inherit" onClick={props.logout}>
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
