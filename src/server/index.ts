import express from "express";
import * as bodyParser from "body-parser";
import coockieParser from "cookie-parser";
import * as dotenv from "dotenv";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes";
import scenariosRoutes from "./routes/scenariosRoutes";
import pagesRoutes from "./routes/pagesRoutes";

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(coockieParser());
app.use(express.static("./src/static"));

app.use("/", pagesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/scenario", scenariosRoutes);

const port = process.env.PORT || 3000;

export const server = app.listen(port);