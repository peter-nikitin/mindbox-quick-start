import { Request, Response, NextFunction, Router } from "express";

import User from "../models/User";
import generateAccessToken from "../helpers/generateAccessToken";
import checkTocken from "../helpers/checkTocken";

const userRoutes = Router();

import { AuthRequestBody } from "src/declarations";

userRoutes.post(
  "/auth",
  async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    try {
      const user = new User(req.body.email, req.body.password);
      const isLoggedSuccessfully = await user.loginStuff();

      let accessToken: string;

      if (isLoggedSuccessfully) {
        accessToken = generateAccessToken(user.email);

        res.send(accessToken);
      } else {
        res.status(403).send('Неправильная почта или пароль');
      }
    } catch (error) {
      console.log(error.response.data);

      res.status(503).send(error.response.data);
    }
  }
);

userRoutes.post("/reg", async (req: Request, res: Response) => {
  const user = new User(req.body.email, req.body.password);
  try {
    const isUserExist = await user.isStuffExistInMindbox();
    if (isUserExist) {
      await user.registrStuff();
      res.sendStatus(200);
    } else {
      res.status(403).send('Такого пользователя на существует');
    }
  } catch (error) {
    console.log(error);
    let errorMessage: string;
    
    if (error.response?.data?.errorMessage) {
      errorMessage = error.response?.data?.errorMessage;
    } else {
      errorMessage = error.response?.data;
    }

    res.status(503).send(errorMessage);
  }
});

userRoutes.get("/checkToken", (req: Request, res: Response) => {
  try {
    checkTocken(req.cookies.token || "");
    res.sendStatus(200)
  } catch (error) {
    console.log(error);
    
    res.sendStatus(403);
  }
});

export default userRoutes;
