import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import applyRouters from "./helpers/applyRouters";
require("dotenv").config();
import path from "path";
import userExistsOrMake from "./helpers/userExistsOrMake";
export const AUTHENTICATION_ERROR_401 = 401;
export const AUTHORIZATION_ERROR_403 = 403;
// export const upload = multer({ dest: "/temp" });
export const prisma = new PrismaClient();

(async () => {
  await userExistsOrMake();

  const TestingMode = false;
  const app = express();
  const PORT = 3002;

  app.use(express.json());
  app.use(express.static(path.resolve("./public")));
  app.use(
    cors({
      credentials: true,
      methods: "*",
    })
  );
  // app.use(handleKeyAccess);

  app.get("/", async (req, res) => {
    res.send(await prisma.user.findMany());
    return;
  });
  app.post("/login", async (req, res) => {
    const admin = await prisma.user.findFirst();
    if (
      admin?.username === req.body.username &&
      admin?.password === req.body.password
    ) {
      const accessToken = jwt.sign(
        Object(admin),
        process.env.ACCESS_TOKEN_SECRET as string
        // { expiresIn: "60m" }
      );
      res.json({ accessToken: accessToken });
    } else {
      res.sendStatus(AUTHENTICATION_ERROR_401);
    }
  });

  // auth middleware function
  function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(AUTHENTICATION_ERROR_401);

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, user) => {
        if (err) return res.sendStatus(AUTHORIZATION_ERROR_403);
        next();
      }
    );
  }

  // auth middleware
  if (!TestingMode) {
    app.use(authenticateToken);
  }

  applyRouters(app);

  app.listen(PORT);
})();
