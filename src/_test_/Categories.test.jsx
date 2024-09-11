import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Categories from "../Pages/Categories/Categories";
import { getAllCategories, categorySearch, deleteCategory } from "../Api/Service/CategoryService";
import DashboardHoc from "../Coponents/HOC/DashboardHoc";
import { Provider } from "react-redux";
import store from "../Redux/Store";
import { BrowserRouter } from "react-router-dom";

jest.mock("../Api/Service/CategoryService");

describe("Categories Component", () => {
  const mockCategories = {
    data: {
      content: [
        { categoryId: 1, categoryName: "Category 1", categoryIcon: "icon1.jpg" },
        { categoryId: 2, categoryName: "Category 2", categoryIcon: "icon2.jpg" },
      ],
      totalPages: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls getAllCategories and sets the categories data correctly", async () => {
    getAllCategories.mockResolvedValue(mockCategories);
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    // Wait for the API call to complete and for the component to update
    await waitFor(() => expect(getAllCategories).toHaveBeenCalledTimes(1));

    // Check if the categories are rendered correctly in the table
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();

    // Check if the table rows corresponding to the categories are rendered
    const tableRows = screen.getAllByRole("row");
    expect(tableRows.length).toBe(3); // 1 for the header row + 2 for the category rows

    // Optionally, check if the category icon is rendered
    const categoryIcons = screen.getAllByRole("img");
    expect(categoryIcons.length).toBe(2);
    expect(categoryIcons[0]).toHaveAttribute("src", "icon1.jpg");
    expect(categoryIcons[1]).toHaveAttribute("src", "icon2.jpg");
  });
});
// test("calls getAllCategories and sets the category data correctly", async () => {
//   getAllCategories.mockResolvedValue(mockCategories);
//   render(
//     <BrowserRouter>
//       <Provider store={store}>
//         <Categories />
//       </Provider>
//     </BrowserRouter>
//   );

//   // Ensure the loader is shown first
//   expect(screen.getByTestId("loader")).toBeInTheDocument();

//   // Wait for the categories to be loaded and the loader to be removed
//   await waitFor(() => expect(getAllCategories).toHaveBeenCalled());

//   // Ensure that the categories are displayed after the loader is removed
//   // await waitFor(() => expect(screen.queryByTestId("loader")).not.toBeInTheDocument());

//   // Now check for the categories
//   const category1 = screen.getByText("Category 1");
//   const category2 = screen.getByText("Category 2");

//   // Ensure that the correct categories are in the document
//   expect(category1).toBeInTheDocument();
//   expect(category2).toBeInTheDocument();

//   // Verify the image and operations (edit, delete buttons) are rendered for each category
//   const images = screen.getAllByAltText(/Category/i);
//   expect(images).toHaveLength(2);
//   expect(images[0]).toHaveAttribute("src", "icon1.jpg");
//   expect(images[1]).toHaveAttribute("src", "icon2.jpg");
// });

//   test("renders Table when categories are fetched", async () => {
//     getAllCategories.mockResolvedValue(mockCategories);

//     render(
//       <BrowserRouter>
//         <Provider store={store}>
//           <Categories />
//         </Provider>
//       </BrowserRouter>
//     );

//     // Wait for the categories to load and the Table to be rendered
//     await waitFor(() => expect(getAllCategories).toHaveBeenCalled());

//     // Check if the Table component is in the document
//     const table = screen.getByRole("table"); // Make sure your table has the role attribute

//     expect(table).toBeInTheDocument();

//     // Optionally check if specific table rows or columns are rendered
//     expect(screen.getByText("Category 1")).toBeInTheDocument();
//     expect(screen.getByText("Category 2")).toBeInTheDocument();
//   });
//   // test("renders Categories component", async () => {
//   //   getAllCategories.mockResolvedValue(mockCategories);

//   //   await waitFor(() => expect(getAllCategories).toHaveBeenCalledTimes(1));
//   //   // expect(screen.getByTestId("category-container")).toBeInTheDocument();

//   //   const cat1 = await screen.findByText("Category 1");
//   //   expect(cat1).toBeInTheDocument();
//   // });

//   // test("shows loader initially and then renders table after loading", async () => {
//   //   render(
//   //     <BrowserRouter>
//   //       <Provider store={store}>
//   //         <Categories />
//   //       </Provider>
//   //     </BrowserRouter>
//   //   );

//   //   expect(screen.getByTestId("loader")).toBeInTheDocument();
//   //   await waitFor(() => expect(screen.getByText("Category 1")).toBeInTheDocument());
//   //   expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
//   // });

//   // test("calls getAllCategories on component load", async () => {
//   //   render(
//   //     <BrowserRouter>
//   //       <Provider store={store}>
//   //         <Categories />
//   //       </Provider>
//   //     </BrowserRouter>
//   //   );

//   //   await waitFor(() => expect(getAllCategories).toHaveBeenCalled());
//   // });

//   // test("search categories by keyword", async () => {
//   //   const searchResults = { data: [{ categoryId: 3, categoryName: "Search Result", categoryIcon: "icon3.jpg" }] };
//   //   categorySearch.mockResolvedValue(searchResults);

//   //   render(
//   //     <BrowserRouter>
//   //       <Provider store={store}>
//   //         <Categories />
//   //       </Provider>
//   //     </BrowserRouter>
//   //   );
//   //   const searchInput = screen.getByPlaceholderText("Search Category");
//   //   fireEvent.change(searchInput, { target: { value: "Search" } });
//   //   fireEvent.click(screen.getByText("Search"));

//   //   await waitFor(() => expect(categorySearch).toHaveBeenCalledWith("Search"));
//   //   await waitFor(() => expect(screen.getByText("Search Result")).toBeInTheDocument());
//   // });

//   // test("shows error if search keyword is less than 3 characters", async () => {
//   //   render(
//   //     <BrowserRouter>
//   //       <Provider store={store}>
//   //         <Categories />
//   //       </Provider>
//   //     </BrowserRouter>
//   //   );
//   //   const searchInput = screen.getByPlaceholderText("Search Category");
//   //   fireEvent.change(searchInput, { target: { value: "ab" } });
//   //   fireEvent.click(screen.getByText("Search"));

//   //   await waitFor(() => expect(screen.getByText("Atleast 3 characters are required!")).toBeInTheDocument());
//   // });

//   // test("opens modal for adding new category", () => {
//   //   render(
//   //     <BrowserRouter>
//   //       <Provider store={store}>
//   //         <Categories />
//   //       </Provider>
//   //     </BrowserRouter>
//   //   );
//   //   const addButton = screen.getByText("Add Category");
//   //   fireEvent.click(addButton);

//   //   expect(screen.getByTestId("category-modal")).toBeInTheDocument();
//   // });

//   // test("opens confirmation modal for deleting a category", async () => {
//   //   render(
//   //     <BrowserRouter>
//   //       <Provider store={store}>
//   //         <Categories />
//   //       </Provider>
//   //     </BrowserRouter>
//   //   );
//   //   await waitFor(() => expect(screen.getByText("Category 1")).toBeInTheDocument());

//   //   const deleteButton = screen.getAllByText("Delete")[0];
//   //   fireEvent.click(deleteButton);

//   //   expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
//   // });

//   // test("confirms category deletion and reloads categories", async () => {
//   //   deleteCategory.mockResolvedValue({ data: { message: "Category deleted successfully" } });

//   //   render(
//   //     <BrowserRouter>
//   //       <Provider store={store}>
//   //         <Categories />
//   //       </Provider>
//   //     </BrowserRouter>
//   //   );
//   //   await waitFor(() => expect(screen.getByText("Category 1")).toBeInTheDocument());

//   //   const deleteButton = screen.getAllByText("Delete")[0];
//   //   fireEvent.click(deleteButton);

//   //   const confirmButton = screen.getByText("Confirm");
//   //   fireEvent.click(confirmButton);

//   //   await waitFor(() => expect(deleteCategory).toHaveBeenCalled());
//   //   await waitFor(() => expect(getAllCategories).toHaveBeenCalledTimes(2)); // once initially, once after delete
//   // });
// });
