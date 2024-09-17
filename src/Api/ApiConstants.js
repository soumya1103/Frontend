const BASE_URL_BOOKS = "/lms/books";

export const GET_ALL_BOOKS_NP = BASE_URL_BOOKS + "/all";

export const GET_ALL_BOOKS = "/lms/books";

export const DELETE_BOOK = BASE_URL_BOOKS + "/id";

export const ADD_BOOK = "/lms/books";

export const UPDATE_BOOK = BASE_URL_BOOKS + "/id";

export const GET_BOOK_BY_ID = BASE_URL_BOOKS + "/id";

export const GET_BOOK_BY_TITLE = BASE_URL_BOOKS + "/title";

export const BOOK_SEARCH = BASE_URL_BOOKS + "/search";

const BASE_URL_CATEGORIES = "/lms/categories";

export const GET_ALL_CATEGORIES_NP = BASE_URL_CATEGORIES + "/all";

export const GET_ALL_CATEGORIES = "/lms/categories";

export const DELETE_CATEGORY = BASE_URL_CATEGORIES + "/id";

export const ADD_CATEGORY = "/lms/categories";

export const UPDATE_CATEGORY = BASE_URL_CATEGORIES + "/id";

export const CATEGORY_SEARCH = BASE_URL_CATEGORIES + "/search";

const BASE_URL_ISSUANCES = "/lms/issuances";

export const GET_ALL_ISSUANCES = "/lms/issuances";

export const GET_ISSUANCES_BY_CREDENTIAL = "/lms/issuance" + "/user";

export const GET_ALL_ISSUANCES_NP = BASE_URL_ISSUANCES + "/all";

export const DELETE_ISSUANCE = BASE_URL_ISSUANCES + "/id";

export const ADD_ISSUANCE = "/lms/issuances";

export const UPDATE_ISSUANCE = BASE_URL_ISSUANCES + "/id";

export const GET_ISSUANCES_BY_BOOK_ID = BASE_URL_ISSUANCES + "/book";

export const GET_ISSUANCES_BY_USER_ID = BASE_URL_ISSUANCES + "/user";

export const ISSUANCE_SEARCH = BASE_URL_ISSUANCES + "/search";

const BASE_URL_AUTH = "/lms";

export const LOGIN = BASE_URL_AUTH + "/login";

export const CURRENT_USER = BASE_URL_AUTH + "/current-user";

const BASE_URL_USERS = "/lms/users";

export const GET_ALL_USERS = "/lms/users";

export const GET_ALL_USERS_NP = BASE_URL_USERS + "/all";

export const GET_USERS_BY_CREDENTIAL = BASE_URL_USERS + "/credential";

export const DELETE_USER = BASE_URL_USERS + "/id";

export const ADD_USER = BASE_URL_USERS + "/user";

export const UPDATE_USER = BASE_URL_USERS + "/id";

export const USER_SEARCH = BASE_URL_USERS + "/search";

const BASE_URL_DASHBOARD = "/lms/dashboard";

export const GET_COUNTS = BASE_URL_DASHBOARD + "/count/all";
