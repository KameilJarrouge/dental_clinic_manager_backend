import { prisma } from "../server";
import express from "express";
const router = express.Router();

router.put("/:id/update", async (req, res) => {
  await prisma.tooth.update({
    data: {
      notes: req.body.notes,
    },
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Tooth Updated!" });
});
router.delete("/:id/delete", async (req, res) => {
  await prisma.tooth.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Tooth Deleted!" });
});

module.exports = router;
