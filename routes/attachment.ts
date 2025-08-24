import { prisma } from "../server";
import express from "express";
import fs from "fs";
import path from "path";
import moment from "moment";
const router = express.Router();

/**
 * GET:: single attachment
 */
router.get("/:id", async (req, res) => {
  const result = await prisma.attachement.findFirst({
    where: { id: Number(req.params.id) },
  });
  res.send(result);
});

/**
 * PUT:: update an attachment
 */
// router.put("/:id/update", upload.single("file"), async (req, res) => {
//   let fileName = {};
//   if (req.file !== undefined) {
//     let prefix =
//       "id--" +
//       Number(req.params.id) +
//       "--timestamp--" +
//       moment().format("yyyy-MM-DD-hh-mm-ss") +
//       "--originalName--";
//     // remove old file
//     let att = await prisma.attachement.findFirst({
//       select: { fileName: true, id: true },
//       where: { id: Number(req.params.id) },
//     });
//     fs.unlinkSync(path.join(__dirname, `../public/xrays/${att?.fileName}`));
//     fileName = { fileName: prefix + req.file.originalname };
//     const tempPath = req.file.path;
//     const targetPath = path.join(
//       __dirname,
//       `../public/xrays/${prefix + req.file.originalname}`
//     );
//     fs.renameSync(tempPath, targetPath);
//   }
//   await prisma.attachement.update({
//     data: {
//       ...fileName,
//       notes: req.body.notes,
//       createdAt: new Date(req.body.createdAt),
//     },
//     where: {
//       id: Number(req.params.id),
//     },
//   });
//   res.send({ statusMessage: "attachment updated!" });
// });

/**
 * DELETE: an attachment
 */
router.delete("/:id/delete", async (req, res) => {
  let att = await prisma.attachement.findFirst({
    select: { fileName: true, id: true },
    where: { id: Number(req.params.id) },
  });
  fs.unlinkSync(path.join(__dirname, `../public/xrays/${att?.fileName}`));
  await prisma.attachement.delete({ where: { id: Number(req.params.id) } });
  res.send({ statusMessage: "Attachment Deleted!" });
});
module.exports = router;
