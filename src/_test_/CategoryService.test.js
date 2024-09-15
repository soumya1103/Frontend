import MockAdapter from "axios-mock-adapter";
import app from "../Api/apiClient";
import {
  getAllCategories,
  getAllCategoriesNp,
  deleteCategory,
  addCategory,
  updateCategory,
  countCategory,
  categorySearch,
} from "../Api/Service/CategoryService";

describe("CategoryService API functions", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(app);
  });

  afterEach(() => {
    mock.reset();
  });

  test("getAllCategories should fetch data correctly", async () => {
    const page = 1;
    const size = 10;
    const responseData = { data: [] };

    mock.onGet("/lms/categories", { params: { page, size } }).reply(200, responseData);

    const response = await getAllCategories(page, size);
    expect(response.data).toEqual(responseData);
  });

  test("getAllCategoriesNp should fetch data correctly", async () => {
    const responseData = { data: [] };

    mock.onGet("/lms/categories/all").reply(200, responseData);

    const response = await getAllCategoriesNp();
    expect(response.data).toEqual(responseData);
  });

  test("deleteCategory should delete data correctly", async () => {
    const categoryId = 1;

    mock.onDelete(`/lms/categories/id/${categoryId}`).reply(200);

    const response = await deleteCategory(categoryId);
    expect(response.status).toBe(200);
  });

  test("addCategory should post data correctly", async () => {
    const categoryData = { name: "new-category" };
    const responseData = { success: true };

    mock.onPost("/lms/categories", categoryData).reply(200, responseData);

    const response = await addCategory(categoryData);
    expect(response.data).toEqual(responseData);
  });

  afterAll(() => {
    mock.restore();
  });

  it("should update category data correctly", async () => {
    const categoryId = "123";
    const categoryData = { categoryName: "Updated Category", categoryIcon: "new-icon.png" };

    mock.onPut(`/lms/categories/id/${categoryId}`).reply(200, {
      message: "Category updated successfully",
    });

    const response = await updateCategory(categoryData, categoryId);

    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Category updated successfully");
  });

  it("should handle 404 error for non-existent category", async () => {
    const categoryId = "999"; // Non-existent category ID
    const categoryData = { categoryName: "Non-existent Category", categoryIcon: "icon.png" };

    mock.onPut(`/lms/categories/id/${categoryId}`).reply(404);

    try {
      await updateCategory(categoryData, categoryId);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test("categorySearch should fetch search results correctly", async () => {
    const keyword = "test";
    const responseData = { results: [] };

    mock.onGet(`/lms/categories/search/${keyword}`).reply(200, responseData);

    const response = await categorySearch(keyword);
    expect(response.data).toEqual(responseData);
  });
});
