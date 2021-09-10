import { AppBar, Toolbar, Link, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                style={{ textDecoration: "none" }}
              >
                Flashcards
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    </Router>
  );
}

export default App;
