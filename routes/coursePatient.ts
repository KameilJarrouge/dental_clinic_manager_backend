import { prisma } from "../server";
import express from "express";
import { CoursePatientWithCourseAndSessionAndTeeth } from "../helpers/complexRelations";
const router = express.Router();

/**
 * GET:: a single coursePatient
 */
router.get("/:id", async (req, res) => {
  let result = await prisma.coursePatient.findFirst({
    where: { id: Number(req.params.id) },
    select: CoursePatientWithCourseAndSessionAndTeeth,
  });
  res.send(result);
});

/**
 * PUT:: update a coursePatient
 */
router.put("/:id/update", async (req, res) => {
  let finish = {};
  if (req.body.isFinished) {
    finish = { finishedAt: new Date() };
  } else {
    finish = { finishedAt: null };
  }
  await prisma.coursePatient.update({
    data: {
      createdAt: req.body.createdAt,
      details: req.body.details,
      isFinished: req.body.isFinished,
      isOld: req.body.isOld,
      ...finish,
    },
    where: { id: Number(req.params.id) },
  });
  res.send({ statusMessage: "Updated Treatment!" });
});
/**
 * DELETE:: delete a coursePatient
 */
router.delete("/:id/delete", async (req, res) => {
  await prisma.coursePatient.delete({
    where: { id: Number(req.params.id) },
  });
  res.send({ statusMessage: "Deleted Treatment!" });
});

/**
 * PUT:: update a coursePatient's status
 */
router.put("/:id/update-status", async (req, res) => {
  let finish = {};
  if (req.body.isFinished) {
    finish = { finishedAt: new Date() };
  } else {
    finish = { finishedAt: null };
  }
  await prisma.coursePatient.update({
    data: {
      isFinished: req.body.isFinished,
      ...finish,
    },
    where: { id: Number(req.params.id) },
  });
  res.send({
    statusMessage: req.body.isFinished
      ? "Treatment Stopped!"
      : "Treatment Resumed!",
  });
});

/**
 * POST:: add a tooth to the coursePatient (CoursePatientTooth)
 */
router.post("/:id/add-course-patient-tooth", async (req, res) => {
  let result = await prisma.coursePatientTooth.create({
    data: { coursePatientId: Number(req.params.id), toothId: req.body.toothId },
  });
  res.send({ statusMessage: "Added Tooth to Treatment!", cptId: result.id });
});
router.post("/:id/remove-course-patient-tooth", async (req, res) => {
  await prisma.coursePatientTooth.delete({
    where: { id: Number(req.body.cptId) },
  });
  res.send({ statusMessage: "Removed Tooth from Treatment!" });
});

/**
 * GET:: coursePatient Sessions
 */
router.get("/:id/sessions", async (req, res) => {
  let conditions = {};
  if (req.query.date !== "Invalid date") {
    conditions = { createdAt: { gte: new Date(String(req.query.date)) } };
  }
  let result = await prisma.session.findMany({
    where: { coursePatientId: Number(req.params.id), ...conditions },
    orderBy: { createdAt: String(req.query.order) === "true" ? "asc" : "desc" },
    take: Number(req.query.take),
  });
  res.send(result);
});

/**
 * POST:: create a session
 */
router.post("/:id/sessions/create", async (req, res) => {
  await prisma.session.create({
    data: {
      coursePatientId: Number(req.params.id),
      createdAt: req.body.createdAt,
      details: req.body.details,
    },
  });
  res.send({ statusMessage: "Session Created!" });
});

module.exports = router;
