import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileButton from "../Component/ProfileButton/ProfileButton";
import { logoutUser } from "../Redux/Authentication/AuthenticationAction";
import { logout } from "../Api/Service/Login";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useNavigate } from "react-router-dom";

// Mock dependencies
jest.mock("../Redux/Authentication/AuthenticationAction", () => ({
  logoutUser: jest.fn(),
}));

jest.mock("../Api/Service/Login", () => ({
  logout: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("ProfileButton Component", () => {
  test("renders with correct initial letter of the name", () => {
    render(
      <Provider store={store}>
        <ProfileButton name="John Doe" />
      </Provider>
    );
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  test("shows and hides dropdown on profile button click", () => {
    render(
      <Provider store={store}>
        <ProfileButton name="John Doe" />
      </Provider>
    );

    // Dropdown should be hidden initially
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();

    // Click the profile button to show the dropdown
    fireEvent.click(screen.getByText("J"));
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Click the profile button again to hide the dropdown
    fireEvent.click(screen.getByText("J"));
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  test("opens confirmation modal when logout button is clicked", () => {
    render(
      <Provider store={store}>
        <ProfileButton name="John Doe" />
      </Provider>
    );

    // Open the dropdown
    fireEvent.click(screen.getByText("J"));

    // Click the logout button
    fireEvent.click(screen.getByText("Logout"));

    // Check if the confirmation modal is displayed
    expect(screen.getByText("Are you sure you want to logout?")).toBeInTheDocument();
  });

  jest.mock("../Api/Service/Login");
  jest.mock("../Redux/Authentication/AuthenticationAction");
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
  }));

  const mockStore = configureStore([]);
  const store = mockStore({});

  describe("ProfileButton Component", () => {
    let navigateMock;

    beforeEach(() => {
      // Mock useNavigate
      navigateMock = jest.fn();
      useNavigate.mockReturnValue(navigateMock);

      // Mock other actions
      logout.mockImplementation(() => {});
      logoutUser.mockImplementation(() => ({ type: "LOGOUT_USER" }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("calls handleLogout when confirmation modal's 'Yes' button is clicked", async () => {
      render(
        <Provider store={store}>
          <ProfileButton name="John Doe" />
        </Provider>
      );

      // Open dropdown and click the logout button
      fireEvent.click(screen.getByText("J"));
      fireEvent.click(screen.getByText("Logout"));

      // Confirmation modal appears, click 'Yes' button
      fireEvent.click(screen.getByText("Yes"));

      // Check if logout, logoutUser, and navigation were called
      await waitFor(() => {
        expect(logout).toHaveBeenCalled();
        expect(logoutUser).toHaveBeenCalled();
        expect(navigateMock).toHaveBeenCalledWith("/login");
      });
    });
  });

  test("closes confirmation modal when 'No' button is clicked", () => {
    render(
      <Provider store={store}>
        <ProfileButton name="John Doe" />
      </Provider>
    );

    // Open the dropdown and click logout
    fireEvent.click(screen.getByText("J"));
    fireEvent.click(screen.getByText("Logout"));

    // Check if the modal is displayed
    expect(screen.getByText("Are you sure you want to logout?")).toBeInTheDocument();

    // Simulate clicking the No button
    fireEvent.click(screen.getByRole("button", { name: /No/i }));

    // Check that the modal is closed
    expect(screen.queryByText("Are you sure you want to logout?")).not.toBeInTheDocument();
  });
});
