import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryModal from "../Pages/Categories/CategoryModal";

jest.mock("../Api/Service/CategoryService", () => ({
  addCategory: jest.fn(),
  updateCategory: jest.fn(),
}));

jest.mock(
  "../Component/Toast/Toast",
  () =>
    ({ message, type, show, onClose }) =>
      show ? <div>{message}</div> : null
);

test("renders Add Category modal", () => {
  render(<CategoryModal isEdit={false} categoryData={{}} onClose={() => {}} reloadCategories={() => {}} auth={{}} />);

  expect(screen.getByText("Add Category")).toBeInTheDocument();
  expect(screen.getByLabelText("Category Name")).toBeInTheDocument();
  expect(screen.getByLabelText("Category Icon")).toBeInTheDocument();
  expect(screen.getByText("Add")).toBeInTheDocument();
});

test("renders Edit Category modal", () => {
  render(
    <CategoryModal
      isEdit={true}
      categoryData={{ categoryName: "Test", categoryIcon: "icon.png" }}
      onClose={() => {}}
      reloadCategories={() => {}}
      auth={{}}
    />
  );

  expect(screen.getByText("Edit Category")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
  expect(screen.getByDisplayValue("icon.png")).toBeInTheDocument();
  expect(screen.getByText("Update")).toBeInTheDocument();
});

test("shows validation errors when fields are empty", () => {
  render(<CategoryModal isEdit={false} categoryData={{}} onClose={() => {}} reloadCategories={() => {}} auth={{}} />);

  fireEvent.click(screen.getByText("Add"));

  expect(screen.getByText("Category name is required.")).toBeInTheDocument();
  expect(screen.getByText("Category icon is required.")).toBeInTheDocument();
});

describe("CategoryModal Component", () => {
  const mockOnInputChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isEdit: false,
    categoryData: { categoryName: "", categoryIcon: "" },
    onInputChange: mockOnInputChange,
    onSubmit: mockOnSubmit,
    onClose: mockOnClose,
  };

  const fillInputs = (categoryName = "", categoryIcon = "") => {
    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: categoryName } });
    fireEvent.change(screen.getByLabelText(/Category Icon/i), { target: { value: categoryIcon } });
  };

  it("should render the modal with input fields and button", () => {
    render(<CategoryModal {...defaultProps} />);
    expect(screen.getByText(/Add Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Icon/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
  });

  it("should display validation errors if fields are empty", () => {
    render(<CategoryModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Add/i }));

    expect(screen.getByText(/Category name is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Category icon is required./i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should allow only alphabets in category name and no special characters", () => {
    render(<CategoryModal {...defaultProps} />);

    fillInputs("123", "icon");

    fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    expect(screen.getByText(/Only alphabets are allowed./i)).toBeInTheDocument();

    fillInputs("Category@", "icon");
    fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    expect(screen.getByText(/No special characters are allowed./i)).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should call onSubmit if form passes validation", () => {
    render(<CategoryModal {...defaultProps} categoryData={{ categoryName: "Valid Category", categoryIcon: "icon" }} />);

    fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("should display 'Edit Category' and update button when isEdit is true", () => {
    render(<CategoryModal {...defaultProps} isEdit={true} />);
    expect(screen.getByText(/Edit Category/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });
});
