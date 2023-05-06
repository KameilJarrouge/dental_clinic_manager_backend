import { prisma } from "../server";
import express from "express";
const router = express.Router();

/**
 * GET:: all courses with search by name of course
 */
router.get("/", async (req, res) => {
  let result = await prisma.course.findMany({
    where: { name: { contains: String(req.query.name) } },
    take: Number(req.query.take),
  });
  res.send(result);
});

/**
 * GET:: all courses names
 */
router.get("/names", async (req, res) => {
  let result = await prisma.course.findMany({
    select: { id: true, name: true },
  });
  res.send(result);
});

/**
 * POST:: create a new Course
 */
router.post("/create", async (req, res) => {
  await prisma.course.create({
    data: {
      name: req.body.name,
      effectName: req.body.effectName,
      colorIndex: Number(req.body.colorIndex),
    },
  });
  res.send({ statusMessage: "Course Created!" });
});

/**
 * PUT:: update a Course
 * made post because I'm lazy ... check the frontend and you'll know why
 */
router.post("/:id/update", async (req, res) => {
  await prisma.course.update({
    data: {
      name: req.body.name,
      effectName: req.body.effectName,
      colorIndex: Number(req.body.colorIndex),
    },
    where: { id: Number(req.params.id) },
  });
  res.send({ statusMessage: "Course Updated!" });
});

/**
 * DELETE:: a Course
 */
router.delete("/:id/delete", async (req, res) => {
  await prisma.course.delete({
    where: { id: Number(req.params.id) },
  });
  res.send({ statusMessage: "Course Deleted!" });
});

/**
 * GET:: a single course
 */
router.get("/:id", async (req, res) => {
  let result = await prisma.course.findFirst({
    where: { id: Number(req.params.id) },
  });
  res.send(result);
});

module.exports = router;
