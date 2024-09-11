import axios from "axios";
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
    mock.restore();
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
    const categoryName = "test-category";

    mock.onDelete(`/lms/categories/name/${categoryName}`).reply(200);

    const response = await deleteCategory(categoryName);
    expect(response.status).toBe(200);
  });

  test("addCategory should post data correctly", async () => {
    const categoryData = { name: "new-category" };
    const responseData = { success: true };

    mock.onPost("/lms/categories", categoryData).reply(200, responseData);

    const response = await addCategory(categoryData);
    expect(response.data).toEqual(responseData);
  });

  test("updateCategory should update data correctly", async () => {
    const categoryName = "test-category";
    const categoryData = { name: "updated-category" };
    const responseData = { success: true };

    mock.onPut(`/lms/categories/name/${categoryName}`, categoryData).reply(200, responseData);

    const response = await updateCategory(categoryData, categoryName);
    expect(response.data).toEqual(responseData);
  });

  test("countCategory should fetch count correctly", async () => {
    const responseData = { count: 100 };

    mock.onGet("/lms/categories/count").reply(200, responseData);

    const response = await countCategory();
    expect(response.data).toEqual(responseData);
  });

  test("categorySearch should fetch search results correctly", async () => {
    const keyword = "test";
    const responseData = { results: [] };

    mock.onGet(`/lms/categories/search/${keyword}`).reply(200, responseData);

    const response = await categorySearch(keyword);
    expect(response.data).toEqual(responseData);
  });
});
