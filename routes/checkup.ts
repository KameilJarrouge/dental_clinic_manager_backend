import { prisma } from "../server";
import express from "express";
const router = express.Router();

/**
 * GET:: a single checkup
 */
router.get("/:id", async (req, res) => {
  let result = await prisma.checkups.findFirst({
    where: { id: Number(req.params.id) },
  });
  res.send(result);
});

/**
 * PUT:: update a checkup
 */
router.put("/:id/update", async (req, res) => {
  await prisma.checkups.update({
    data: { createdAt: req.body.createdAt, notes: req.body.notes },
    where: { id: Number(req.params.id) },
  });
  res.send({ statusMessage: "Check-up Updated!" });
});

/**
 * DELETE: a checkup
 */
router.delete("/:id/delete", async (req, res) => {
  await prisma.checkups.delete({ where: { id: Number(req.params.id) } });
  res.send({ statusMessage: "Check-up Deleted!" });
});

module.exports = router;
