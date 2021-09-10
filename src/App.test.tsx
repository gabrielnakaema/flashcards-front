import { render, screen } from "@testing-library/react";
import App from "./App";

it("should render flashcards title", () => {
  render(<App />);
  const linkElement = screen.getByText(/Flashcards/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute("href", "/");
});
