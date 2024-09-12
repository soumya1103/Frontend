import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryModal from "../Pages/Categories/CategoryModal";
import { addCategory } from "../Api/Service/CategoryService";

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

test("submits form successfully", async () => {
  addCategory.mockResolvedValue({ status: 201 });

  render(<CategoryModal isEdit={false} categoryData={{}} onClose={() => {}} reloadCategories={() => {}} auth={{ token: "123" }} />);

  fireEvent.change(screen.getByLabelText("Category Name"), { target: { value: "New Category" } });
  fireEvent.change(screen.getByLabelText("Category Icon"), { target: { value: "icon.png" } });
  fireEvent.click(screen.getByText("Add"));

  expect(addCategory).toHaveBeenCalledWith({ categoryName: "New Category", categoryIcon: "icon.png" });
  expect(await screen.findByText("Category added successfully!")).toBeInTheDocument();
});

test("handles errors on submission", async () => {
  addCategory.mockResolvedValue({ status: 500 });

  render(<CategoryModal isEdit={false} categoryData={{}} onClose={() => {}} reloadCategories={() => {}} auth={{ token: "123" }} />);

  fireEvent.change(screen.getByLabelText("Category Name"), { target: { value: "New Category" } });
  fireEvent.change(screen.getByLabelText("Category Icon"), { target: { value: "icon.png" } });
  fireEvent.click(screen.getByText("Add"));

  expect(addCategory).toHaveBeenCalledWith({ categoryName: "New Category", categoryIcon: "icon.png" });
});
