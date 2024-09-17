import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CategoryOperations from "../Pages/Categories/CategoryOperations";

describe("CategoryOperations Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockCategory = {
    categoryId: 1,
    categoryName: "Test Category",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders CategoryOperations component correctly", () => {
    render(<CategoryOperations category={mockCategory} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Check if the Operation component is rendered
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  test("calls onEdit with the correct category when Edit button is clicked", () => {
    render(<CategoryOperations category={mockCategory} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Find and click the Edit button by its alt text
    const editButton = screen.getByAltText(/edit/i); // Adjust selector as needed
    fireEvent.click(editButton);

    // Check if onEdit was called with the correct category
    expect(mockOnEdit).toHaveBeenCalledWith(mockCategory);
  });

  test("calls onDelete with the correct category name when Delete button is clicked", () => {
    render(<CategoryOperations category={mockCategory} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Find and click the Delete button by its alt text
    const deleteButton = screen.getByAltText(/delete/i); // Adjust selector as needed
    fireEvent.click(deleteButton);

    // Check if onDelete was called with the correct category name
    expect(mockOnDelete).toHaveBeenCalledWith(mockCategory.categoryId);
  });
});
