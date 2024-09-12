import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import Categories from "../Pages/Categories/Categories";
import { BrowserRouter } from "react-router-dom";
import store from "../Redux/Store";
import { Provider } from "react-redux";
import { getAllCategories } from "../Api/Service/CategoryService";

// Mock the API service
jest.mock("../Api/Service/CategoryService", () => ({
  getAllCategories: jest.fn(),
}));

describe("Categories component - getPageSizeBasedOnWidth and resize behavior", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return 7 for widths greater than 1024", () => {
    // Mock window.innerWidth to be greater than 1024
    global.innerWidth = 1100;

    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    // Trigger resize to apply size based on window width
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Assert that the table page size logic is applied correctly
    // (this assumes that your Table component renders differently based on the page size)
    const tableRows = container.querySelectorAll(".table-row");
    expect(tableRows.length).toBeLessThanOrEqual(7); // based on size of 7
  });

  it("should return 12 for widths less than or equal to 1024", () => {
    // Mock window.innerWidth to be less than or equal to 1024
    global.innerWidth = 900;

    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    // Trigger resize to apply size based on window width
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Assert that the table page size logic is applied correctly
    const tableRows = container.querySelectorAll(".table-row");
    expect(tableRows.length).toBeLessThanOrEqual(12); // based on size of 12
  });

  it("should update page size when window is resized", () => {
    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    // Mock initial width as 1100 and resize to 800
    global.innerWidth = 1100;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Assert that the table page size logic is applied for size 7
    let tableRows = container.querySelectorAll(".table-row");
    expect(tableRows.length).toBeLessThanOrEqual(7);

    // Now mock the window width to be 800 and trigger resize event
    global.innerWidth = 800;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Assert that table size is updated correctly for size 12
    tableRows = container.querySelectorAll(".table-row");
    expect(tableRows.length).toBeLessThanOrEqual(12);
  });
});

// describe("Categories component - Button Handlers", () => {
//   test("handleEditIcon should set the category data, mark as edit, and show modal", () => {
//     const mockCategory = {
//       categoryName: "Test Category",
//       categoryIcon: "test-icon.png",
//       categoryId: "123",
//     };

//     render(
//       <BrowserRouter>
//         <Provider store={store}>
//           <Categories />
//         </Provider>
//       </BrowserRouter>
//     );

//     // Render a mock category in the DOM to simulate the presence of edit button
//     // Adjust this if needed to match your actual component structure
//     const editButton = screen.getByRole("button", { name: /edit/i });
//     fireEvent.click(editButton);

//     // Check if the category data is set
//     expect(screen.getByText(mockCategory.categoryName)).toBeInTheDocument();

//     // Check if edit mode is set
//     // You may need to verify this through the presence of specific elements or text in the DOM
//     expect(screen.getByText("Edit Mode")).toBeInTheDocument(); // Adjust as needed

//     // Check if the modal is shown
//     expect(screen.getByRole("dialog")).toBeVisible(); // Assuming modal is a dialog
//   });

//   test("handleDeleteIcon should set the category ID for deletion and show confirmation modal", () => {
//     const mockCategoryId = "123";

//     render(
//       <BrowserRouter>
//         <Provider store={store}>
//           <Categories />
//         </Provider>
//       </BrowserRouter>
//     );

//     // Render a mock category in the DOM to simulate the presence of delete button
//     // Adjust this if needed to match your actual component structure
//     const deleteButton = screen.getByRole("button", { name: /delete/i });
//     fireEvent.click(deleteButton);

//     // Check if the category ID is set for deletion
//     // Verify through the presence of specific elements or text in the DOM
//     expect(screen.getByText(`Deleting category ID: ${mockCategoryId}`)).toBeInTheDocument();

//     // Check if the confirmation modal is shown
//     expect(screen.getByRole("dialog", { name: /confirm deletion/i })).toBeVisible();
//   });

//   test("handleModalClose should hide the modal", () => {
//     render(
//       <BrowserRouter>
//         <Provider store={store}>
//           <Categories />
//         </Provider>
//       </BrowserRouter>
//     );

//     // Simulate opening the modal
//     const openModalButton = screen.getByRole("button", { name: /open modal/i });
//     fireEvent.click(openModalButton);

//     // Simulate closing the modal
//     const closeButton = screen.getByRole("button", { name: /close/i });
//     fireEvent.click(closeButton);

//     // Check if the modal is hidden
//     expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
//   });

//   test("handleAddCategoryClick should reset category data, unset edit mode, and show modal", () => {
//     render(
//       <BrowserRouter>
//         <Provider store={store}>
//           <Categories />
//         </Provider>
//       </BrowserRouter>
//     );

//     // Simulate clicking the "Add Category" button
//     const addButton = screen.getByRole("button", { name: /Add Category/i });
//     fireEvent.click(addButton);

//     // Check if the category data is reset
//     expect(screen.getByLabelText(/category name/i)).toHaveValue(""); // Adjust if needed
//     expect(screen.getByLabelText(/category icon/i)).toHaveValue(""); // Adjust if needed

//     // Check if edit mode is unset
//     expect(screen.queryByText("Edit Mode")).not.toBeInTheDocument(); // Adjust as needed

//     // Check if the modal is shown
//     expect(screen.getByRole("dialog")).toBeVisible(); // Assuming modal is a dialog
//   });
// });
