import { prisma, upload } from "../server";
import express from "express";
import {
  CoursePatientWithCourseAndSessionAndTeeth,
  CoursePatientWithCourseAndTeeth,
  ToothWithBadges,
} from "../helpers/complexRelations";
import path from "path";
import moment from "moment";
const router = express.Router();
import fs from "fs";

/**
 * GET:: all patients endpoint with search
 */
router.get("/", async (req, res) => {
  const result = await prisma.patient.findMany({
    select: { id: true, name: true, age: true, occupation: true },
    where: { name: { contains: String(req.query.name) } },
    take: Number(req.query.take),
  });
  res.send(result);
});

/**
 * GET:: patients for the navbar search
 */
router.get("/search", async (req, res) => {
  // let pagination = {};
  // if (Number(req.query.take) !== 0) {
  //   pagination = { take: Number(req.query.take) };
  // }
  let result = await prisma.patient.findMany({
    select: { id: true, name: true },
    where: {
      name: { contains: String(req.query.name) },
    },
    take: Number(req.query.take),
  });
  res.send(result);
});

/**
 * GET:: active patients with their treatments
 */
router.get("/active", async (req, res) => {
  let result = await prisma.patient.findMany({
    where: { CoursePatients: { some: { isOld: false, isFinished: false } } },
    select: {
      id: true,
      name: true,
      CoursePatients: {
        select: CoursePatientWithCourseAndTeeth,
        where: { isOld: false, isFinished: false },
      },
    },
  });
  res.send(result);
});

/**
 * POST:: create a patient with a set of teeth
 */
router.post("/create", async (req, res) => {
  const patient = await prisma.patient.create({
    data: {
      name: req.body.name,
      age: req.body.age,
      sex: req.body.sex,
      contact: req.body.contact,
      occupation: req.body.occupation,
      details: req.body.details,
    },
  });

  let teethInsert = Array();
  for (const tooth of req.body.teeth) {
    teethInsert.push(
      prisma.tooth.create({
        data: {
          number: tooth.number,
          notes: tooth.notes,
          patientId: patient.id,
        },
      })
    );
  }
  await prisma.$transaction(teethInsert);
  res.send({ id: patient.id, statusMessage: "Patient Added!" });
});

/**
 * DELETE:: a single patient
 */
router.delete("/:id/delete", async (req, res) => {
  await prisma.patient.delete({ where: { id: Number(req.params.id) } });
  res.send({ statusMessage: "Patient Deleted!" });
});

/**
 * DELETE:: all patients [dev only]
 */
router.delete("/delete", async (req, res) => {
  await prisma.patient.deleteMany();
  res.send("deleted all users");
});

/**
 * GET:: all attachments of a patient
 */
router.get("/:id/attachments", async (req, res) => {
  let dateCondition = {};
  if (req.query.date !== "Invalid date") {
    dateCondition = { createdAt: { gte: new Date(String(req.query.date)) } };
  }
  const result = await prisma.attachement.findMany({
    where: { patientId: Number(req.params.id), ...dateCondition },
    orderBy: { createdAt: String(req.query.order) === "true" ? "asc" : "desc" },
    take: Number(req.query.take),
  });
  res.send(result);
});

/**
 * POST:: create a new attachment
 */
router.post(
  "/:id/attachments/create",
  upload.single("file"),
  async (req, res) => {
    let prefix =
      "id--" +
      Number(req.params.id) +
      "--timestamp--" +
      moment().format("yyyy-MM-DD-hh-mm-ss") +
      "--originalName--";
    if (req.file === undefined) return;
    const tempPath = req.file.path;
    const targetPath = path.join(
      __dirname,
      `../public/xrays/${prefix + req.file.originalname}`
    );
    fs.renameSync(tempPath, targetPath);

    await prisma.attachement.create({
      data: {
        fileName: prefix + req.file.originalname,
        notes: req.body.notes,
        createdAt: new Date(req.body.createdAt),
        patientId: Number(req.params.id),
      },
    });
    res.send({ statusMessage: "attachment added!" });
  }
);

/**
 * GET:: all checkups of a patient
 */
router.get("/:id/checkups", async (req, res) => {
  let dateCondition = {};
  if (req.query.date !== "Invalid date") {
    dateCondition = { createdAt: { gte: new Date(String(req.query.date)) } };
  }
  let result = await prisma.checkups.findMany({
    where: {
      patientId: Number(req.params.id),
      ...dateCondition,
    },
    orderBy: { createdAt: String(req.query.order) === "true" ? "asc" : "desc" },
    take: Number(req.query.take),
  });
  res.send(result);
});

/**
 * POST:: create a new checkup
 */
router.post("/:id/checkups/create", async (req, res) => {
  await prisma.checkups.create({
    data: {
      createdAt: req.body.createdAt,
      notes: req.body.notes,
      patientId: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Checkup Created!" });
});

/**
 * GET:: all CoursePatient
 */
router.get("/:id/courses-patients", async (req, res) => {
  let conditions = {};
  if (req.query.date !== "Invalid date") {
    conditions = { createdAt: { gte: new Date(String(req.query.date)) } };
  }
  if (req.query.name !== "") {
    conditions = {
      ...conditions,
      Course: { name: { contains: req.query.name } },
    };
  }
  let result = await prisma.coursePatient.findMany({
    where: { patientId: Number(req.params.id), ...conditions },
    select: CoursePatientWithCourseAndTeeth,
    orderBy: { createdAt: String(req.query.order) === "true" ? "asc" : "desc" },
    take: Number(req.query.take),
  });
  res.send(result);
});

router.get("/:id/courses-patients/active", async (req, res) => {
  let conditions = {};
  if (req.query.date !== "Invalid date") {
    conditions = { createdAt: { gte: new Date(String(req.query.date)) } };
  }
  if (req.query.name !== "") {
    conditions = {
      ...conditions,
      Course: { name: { contains: req.query.name } },
    };
  }
  let result = await prisma.coursePatient.findMany({
    where: {
      patientId: Number(req.params.id),
      isOld: false,
      isFinished: false,
      ...conditions,
    },
    select: CoursePatientWithCourseAndTeeth,
    orderBy: { createdAt: String(req.query.order) === "true" ? "asc" : "desc" },
    take: Number(req.query.take),
  });
  res.send(result);
});

/**
 * POST:: create a CoursePatient
 */
router.post("/:id/courses-patients/create/", async (req, res) => {
  let coursePatient = await prisma.coursePatient.create({
    data: {
      courseId: Number(req.body.courseId),
      patientId: Number(req.params.id),
      createdAt: req.body.createdAt,
      details: req.body.details,
      isFinished: req.body.isFinished,
      isOld: req.body.isOld,
    },
  });
  let coursePatientTeeth = Array();
  for (const tooth of req.body.teeth) {
    coursePatientTeeth.push(
      prisma.coursePatientTooth.create({
        data: {
          coursePatientId: coursePatient.id,
          toothId: tooth,
        },
      })
    );
  }
  await prisma.$transaction(coursePatientTeeth);
  res.send({ statusMessage: "Started Treatment for Patient!" });
});

/**
 * GET:: a single patient
 */
router.get("/:id", async (req, res) => {
  let result = await prisma.patient.findFirst({
    where: {
      id: Number(req.params.id),
    },
    include: {
      Teeth: {
        select: ToothWithBadges,
      },
    },
  });
  res.send(result);
});

/**
 * GET:: a single patient's teeth
 */
router.get("/:id/teeth", async (req, res) => {
  let result = await prisma.tooth.findMany({
    where: {
      patientId: Number(req.params.id),
    },
    select: ToothWithBadges,
  });
  res.send(result);
});

/**
 * POST:: add teeth
 */
router.post("/:id/teeth/create", async (req, res) => {
  await prisma.tooth.create({
    data: {
      number: req.body.number,
      notes: req.body.notes,
      patientId: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Tooth Added!" });
});

/**
 * PUT:: update a patient
 */
router.put("/:id/update", async (req, res) => {
  const patient = await prisma.patient.update({
    data: {
      name: req.body.name,
      age: req.body.age,
      sex: req.body.sex,
      contact: req.body.contact,
      occupation: req.body.occupation,
      details: req.body.details,
    },
    where: { id: Number(req.params.id) },
  });
  res.send({ patient: patient, statusMessage: "Patient Updated!" });
});

module.exports = router;
