import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

import useAuth, { ProvideAuth } from "client/script/hooks/useAuth";
import Login from "client/script/pages/Login";

import { loginUser } from "client/script/api/userRequests";
// import { User, AuthUserResponse } from "src/declarations";

jest.mock("axios");
jest.mock("client/script/api/userRequests");

const customRender = (ui: any, { providerProps, ...renderOptions }: any) => {
  return render(
    <ProvideAuth {...providerProps}>{ui}</ProvideAuth>,
    renderOptions
  );
};

describe("Test render of form", () => {
  // const mockedAuthUser = (user: User) => {};
  test("should login input be in the doc", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginInput = screen.getByLabelText("Логин");
    expect(loginInput).toBeInTheDocument();
  });

  test("should password input be in the doc", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const passwordInput = screen.getByLabelText("Пароль");
    expect(passwordInput).toBeInTheDocument();
  });
});

describe("Form submit", () => {
  it("should call passed function", async () => {
    customRender(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
      {}
    );

    const login = screen.getByLabelText("Логин");
    const password = screen.getByLabelText("Пароль");
    const submitBtn = screen.getByText("Войти");

    await act(async () => {
      fireEvent.input(login, { target: { value: "nikitin@mindbox.ru" } });
    });
    await act(async () => {
      fireEvent.input(password, { target: { value: "123" } });
    });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(loginUser).toHaveBeenLastCalledWith({
      email: "nikitin",
      password: "123",
    });
  });

  it("should render rejected value", async () => {
    const mockedLogin = loginUser as jest.Mock;
    mockedLogin.mockRejectedValue({ status: 401, data: "LoginError" });

    customRender(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
      {}
    );

    const submitBtn = screen.getByText("Войти");
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    const error = screen.getByText("Ошибка входа");

    expect(error).toBeInTheDocument();
  });
});
