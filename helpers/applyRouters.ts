export default function applyRouters(app) {
  const userRouter = require("../routes/user");
  app.use("/user", userRouter);

  const attachmentRouter = require("../routes/attachment");
  app.use("/attachments", attachmentRouter);

  const checkupRouter = require("../routes/checkup");
  app.use("/checkups", checkupRouter);

  const patientRouter = require("../routes/patient");
  app.use("/patients", patientRouter);

  const courseRouter = require("../routes/course");
  app.use("/courses", courseRouter);

  const toothRouter = require("../routes/tooth");
  app.use("/teeth", toothRouter);

  const coursePatientRouter = require("../routes/coursePatient");
  app.use("/courses-patients", coursePatientRouter);
  const sessionRouter = require("../routes/session");
  app.use("/sessions", sessionRouter);
}
