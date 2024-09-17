// Input.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "../Component/Input/Input";

// Mock Error component if necessary
jest.mock(
  "../Component/Error/Error",
  () =>
    ({ error }) =>
      error ? <div>{error}</div> : null
);

describe("Input Component", () => {
  test("renders with label and placeholder", () => {
    render(<Input label="Category Name" name="categoryName" type="text" value="" onChange={() => {}} />);

    expect(screen.getByLabelText("Category Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Category Name")).toBeInTheDocument();
  });

  test("calls onChange handler when value changes", () => {
    const handleChange = jest.fn();
    render(<Input label="Category Name" name="categoryName" type="text" value="" onChange={handleChange} />);

    fireEvent.change(screen.getByLabelText("Category Name"), { target: { value: "New Value" } });

    expect(handleChange).toHaveBeenCalled();
  });

  test("displays error message when provided", () => {
    render(<Input label="Category Name" name="categoryName" type="text" value="" onChange={() => {}} error="This field is required." />);

    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });

  test("does not display error message when not provided", () => {
    render(<Input label="Category Name" name="categoryName" type="text" value="" onChange={() => {}} />);

    expect(screen.queryByText("This field is required.")).toBeNull();
  });

  test("is read-only when readOnly prop is true", () => {
    render(<Input label="Category Name" name="categoryName" type="text" value="Read Only Value" onChange={() => {}} readOnly />);

    const input = screen.getByLabelText("Category Name");
    expect(input).toHaveAttribute("readOnly");
    expect(input).toHaveValue("Read Only Value");
  });

  test("applies additional className correctly", () => {
    render(<Input label="Category Name" name="categoryName" type="text" value="" onChange={() => {}} className="extra-class" />);

    expect(screen.getByLabelText("Category Name")).toHaveClass("form-field-input extra-class");
  });
});
