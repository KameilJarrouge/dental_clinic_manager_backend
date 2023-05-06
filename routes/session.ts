import { decrypt, encrypt } from "../encryption";
import { AUTHENTICATION_ERROR_401, prisma } from "../server";
import express from "express";
const router = express.Router();

/**
 * GET:: a single session
 */
router.get("/:id", async (req, res) => {
  let result = await prisma.session.findFirst({
    where: { id: Number(req.params.id) },
  });
  res.send(result);
});

/**
 * PUT:: update a session
 */
router.put("/:id/update", async (req, res) => {
  await prisma.session.update({
    data: { createdAt: req.body.createdAt, details: req.body.details },
    where: { id: Number(req.params.id) },
  });
  res.send({ statusMessage: "Session Updated!" });
});

/**
 * DELETE: a session
 */
router.delete("/:id/delete", async (req, res) => {
  await prisma.session.delete({ where: { id: Number(req.params.id) } });
  res.send({ statusMessage: "Session Deleted!" });
});

module.exports = router;
