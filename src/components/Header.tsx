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
              <Button
                component={RouterLink}
                to="/signin"
                color="inherit"
                sx={{
                  textTransform: 'none',
                }}
              >
                <Typography>Sign in</Typography>
              </Button>
              <Button
                component={RouterLink}
                to="/signup"
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                <Typography>Sign up</Typography>
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
