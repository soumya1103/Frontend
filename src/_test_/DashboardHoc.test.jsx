import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardHoc from "../Component/Hoc/DashboardHoc";
import Navigation from "../Component/Navigation/Navigation";
import Sidebar from "../Component/Sidebar/Sidebar";

// Mock the components
jest.mock("../Component/Navigation/Navigation", () => () => <div>Navigation Component</div>);
jest.mock("../Component/Sidebar/Sidebar", () => () => <div>Sidebar Component</div>);

const MockComponent = () => <div>Mock Component</div>;
const WrappedComponent = DashboardHoc(MockComponent);

describe("DashboardHoc HOC", () => {
  test("renders Navigation and Sidebar components", () => {
    render(<WrappedComponent />);

    // Check if Navigation and Sidebar are rendered
    expect(screen.getByText("Navigation Component")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Component")).toBeInTheDocument();
  });

  test("renders the wrapped component", () => {
    render(<WrappedComponent />);

    // Check if the wrapped component is rendered
    expect(screen.getByText("Mock Component")).toBeInTheDocument();
  });
});
