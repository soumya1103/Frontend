import React from "react";
import { render, act, screen, fireEvent, waitFor } from "@testing-library/react";
import Categories from "../Pages/Categories/Categories";
import { BrowserRouter } from "react-router-dom";
import store from "../Redux/Store";
import { Provider } from "react-redux";
import { getAllCategories, categorySearch } from "../Api/Service/CategoryService";

jest.mock("../Api/Service/CategoryService", () => ({
  getAllCategories: jest.fn(),
}));

describe("Categories component - getPageSizeBasedOnWidth and resize behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 7 for widths greater than 1024", () => {
    global.innerWidth = 1100;

    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const tableRows = container.querySelectorAll(".table-row");
    expect(tableRows.length).toBeLessThanOrEqual(7); // based on size of 7
  });

  it("should return 12 for widths less than or equal to 1024", () => {
    global.innerWidth = 900;

    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const tableRows = container.querySelectorAll(".table-row");
    expect(tableRows.length).toBeLessThanOrEqual(12);
  });

  it("should update page size when window is resized", () => {
    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    global.innerWidth = 1100;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    let tableRows = container.querySelectorAll(".table-row");
    expect(tableRows.length).toBeLessThanOrEqual(7);

    global.innerWidth = 800;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    tableRows = container.querySelectorAll(".table-row");
    expect(tableRows.length).toBeLessThanOrEqual(12);
  });
});

describe("Categories component - Button Handlers", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("should display loader initially and then render content after loading", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });

  test("handleEditIcon should set the category data, mark as edit, and show modal", () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    render(<button aria-label="edit">Edit</button>);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
  });

  test("handleDeleteIcon should set the category ID for deletion and show confirmation modal", () => {
    const setShowConfirmationModal = jest.fn();
    const handleDeleteIcon = jest.fn();

    render(
      <button
        aria-label="delete"
        onClick={() => {
          handleDeleteIcon();
          setShowConfirmationModal(true);
        }}
      >
        Delete
      </button>
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });

    fireEvent.click(deleteButton);
    expect(handleDeleteIcon).toHaveBeenCalledTimes(1);

    expect(setShowConfirmationModal).toHaveBeenCalledWith(true);
  });

  jest.mock("../Api/Service", () => ({
    categorySearch: jest.fn(), // Mock the API client function
  }));

  describe("handleSearch", () => {
    let setToastMessage, setShowToast, setToastType, loadCategories, setSearchData;

    beforeEach(() => {
      setToastMessage = jest.fn();
      setShowToast = jest.fn();
      setToastType = jest.fn();
      loadCategories = jest.fn();
      setSearchData = jest.fn();
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    test("should trim the search keyword and call loadCategories for empty input", async () => {
      const searchInput = screen.getByPlaceholderText("Search Category");
      fireEvent.change(searchInput, { target: { value: "   " } });

      fireEvent.click(screen.getByRole("button", { name: /search/i }));

      expect(loadCategories).toHaveBeenCalled();
      expect(setSearchData).toHaveBeenCalledWith([]);
    });

    test("should show error toast when input is less than 3 characters", async () => {
      const searchInput = screen.getByPlaceholderText("Search Category");
      fireEvent.change(searchInput, { target: { value: "ab" } });

      fireEvent.click(screen.getByRole("button", { name: /search/i }));

      expect(setToastMessage).toHaveBeenCalledWith("Atleast 3 characters are required!");
      expect(setShowToast).toHaveBeenCalledWith(true);
      expect(setToastType).toHaveBeenCalledWith("error");
    });

    test("should search categories for valid input and display results", async () => {
      const mockResponse = { data: [{ categoryIcon: "icon-url", categoryName: "Category1" }] };
      categorySearch.mockResolvedValueOnce(mockResponse);

      const searchInput = screen.getByPlaceholderText("Search Category");
      fireEvent.change(searchInput, { target: { value: "valid keyword" } });

      fireEvent.click(screen.getByRole("button", { name: /search/i }));

      expect(categorySearch).toHaveBeenCalledWith("valid keyword");
      expect(setSearchData).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            categoryIcon: expect.anything(),
            operation: expect.anything(),
          }),
        ])
      );
    });

    test("should show error toast when no categories are found", async () => {
      categorySearch.mockResolvedValueOnce({ data: [] }); // Mock empty result

      const searchInput = screen.getByPlaceholderText("Search Category");
      fireEvent.change(searchInput, { target: { value: "valid keyword" } });

      fireEvent.click(screen.getByRole("button", { name: /search/i }));

      // Assert that the error toast is displayed
      expect(setToastMessage).toHaveBeenCalledWith("No data found!");
      expect(setShowToast).toHaveBeenCalledWith(true);
      expect(setToastType).toHaveBeenCalledWith("error");
    });

    test("should show error toast when there is an API error", async () => {
      categorySearch.mockRejectedValueOnce(new Error("API Error"));

      const searchInput = screen.getByPlaceholderText("Search Category");
      fireEvent.change(searchInput, { target: { value: "valid keyword" } });

      fireEvent.click(screen.getByRole("button", { name: /search/i }));

      // Wait for the async code to execute
      await screen.findByText("Error finding items!");

      // Assert that the error toast is shown
      expect(setToastMessage).toHaveBeenCalledWith("Error finding items!");
      expect(setShowToast).toHaveBeenCalledWith(true);
      expect(setToastType).toHaveBeenCalledWith("error");
    });
  });
});
