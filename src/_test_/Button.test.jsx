import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Component/Button/Button";

describe("Button Component", () => {
  test("renders with correct text", () => {
    render(<Button>Click Me</Button>);

    // Check if the button contains the correct text
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("calls onClick handler when clicked", () => {
    const handleClick = jest.fn(); // Create a mock function
    render(<Button onClick={handleClick}>Click Me</Button>);

    // Simulate a click event
    fireEvent.click(screen.getByText("Click Me"));

    // Verify that the onClick handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
