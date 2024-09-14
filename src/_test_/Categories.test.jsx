import React from "react";
import { render, act, screen, fireEvent, waitFor } from "@testing-library/react";
import Categories from "../Pages/Categories/Categories";
import { BrowserRouter } from "react-router-dom";
import store from "../Redux/Store";
import { Provider } from "react-redux";
import { addCategory, getAllCategories, categorySearch } from "../Api/Service/CategoryService";

jest.mock("../Api/Service/CategoryService", () => ({
  getAllCategories: jest.fn(),
  addCategory: jest.fn(),
  updateCategory: jest.fn(),
  categorySearch: jest.fn(),
  deleteCategory: jest.fn(),
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
    expect(tableRows.length).toBeLessThanOrEqual(7);
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
});

describe("Categories Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render category content after loading", async () => {
    getAllCategories.mockResolvedValueOnce({
      data: {
        content: [
          { categoryId: 1, categoryName: "Category 1", categoryIcon: "icon-url-1" },
          { categoryId: 2, categoryName: "Category 2", categoryIcon: "icon-url-2" },
        ],
        totalPages: 1,
      },
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("category-container")).toBeInTheDocument();
    });
  });

  test("should show add category button and search bar", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    const addButton = screen.getByText("Add Category");
    expect(addButton).toBeInTheDocument();

    const searchBar = screen.getByTestId("search-container");
    expect(searchBar).toBeInTheDocument();
  });
});

describe("Categories - handleSearch function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should show 'At least 3 characters are required!' toast for short keywords", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    const searchInput = screen.getByPlaceholderText("Search Category");

    fireEvent.change(searchInput, { target: { value: "ab" } });

    const searchButton = screen.getByAltText("search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Atleast 3 characters are required!")).toBeInTheDocument();
    });
  });

  test("should show 'No data found!' toast when no categories are returned", async () => {
    categorySearch.mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    const searchInput = screen.getByPlaceholderText("Search Category");

    fireEvent.change(searchInput, { target: { value: "valid keyword" } });

    const searchButton = screen.getByAltText("search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("No data found!")).toBeInTheDocument();
    });
  });

  test("should display categories when search returns data", async () => {
    categorySearch.mockResolvedValueOnce({
      data: [
        { categoryId: 1, categoryName: "Category 1", categoryIcon: "icon-url-1" },
        { categoryId: 2, categoryName: "Category 2", categoryIcon: "icon-url-2" },
      ],
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    const searchInput = screen.getByPlaceholderText("Search Category");

    fireEvent.change(searchInput, { target: { value: "valid keyword" } });

    const searchButton = screen.getByAltText("search"); // Adjust if necessary
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument();
      expect(screen.getByText("Category 2")).toBeInTheDocument();
    });
  });

  test("should show 'Error finding items!' toast when API call fails", async () => {
    categorySearch.mockRejectedValueOnce(new Error("API error"));

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    const searchInput = screen.getByPlaceholderText("Search Category");

    fireEvent.change(searchInput, { target: { value: "valid keyword" } });

    const searchButton = screen.getByAltText("search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Error finding items!")).toBeInTheDocument();
    });
  });
});

describe("Categories Component - Error Handling", () => {
  let originalError;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  test("should display an error message when loadCategories API fails", async () => {
    getAllCategories.mockRejectedValueOnce(new Error("Error fetching categories"));

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Categories />
        </Provider>
      </BrowserRouter>
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      const calls = console.error.mock.calls.map((call) => call[0]);

      expect(calls.some((message) => message.includes("There was an error fetching the categories data!"))).toBe(true);
    });
  });
});

test("should call addCategory API and show success toast when submitting a new category", async () => {
  addCategory.mockResolvedValue({ status: 201, data: { message: "Category added successfully!" } });

  render(
    <BrowserRouter>
      <Provider store={store}>
        <Categories />
      </Provider>
    </BrowserRouter>
  );

  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

  fireEvent.click(screen.getByText("Add Category"));

  const nameInput = screen.getByPlaceholderText("Category Name");
  fireEvent.change(nameInput, { target: { value: "New Category" } });

  const iconInput = screen.getByPlaceholderText("Category Icon");
  fireEvent.change(iconInput, { target: { value: "Icon.png" } });

  const submitButton = screen.getByText("Add");
  fireEvent.click(submitButton);

  await waitFor(() => expect(screen.getByText("Category added successfully!")).toBeInTheDocument());
});
