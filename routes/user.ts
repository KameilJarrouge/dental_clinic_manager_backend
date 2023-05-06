import { decrypt, encrypt } from "../encryption";
import { AUTHENTICATION_ERROR_401, prisma } from "../server";
import express from "express";
const router = express.Router();

// router.get("/logout", (req, res) => {});

router.put("/update", async (req, res) => {
  const admin = await prisma.user.findFirst();
  if (
    admin?.username === req.body.username &&
    decrypt(admin?.password) === req.body.password
  ) {
    await prisma.user.update({
      data: {
        username: req.body.newUsername,
        password: encrypt(req.body.newPassword),
      },
      where: { id: admin?.id },
    });
    res.send({ statusMessage: "Updated User !" });
  } else {
    res.sendStatus(AUTHENTICATION_ERROR_401);
  }
});

module.exports = router;
