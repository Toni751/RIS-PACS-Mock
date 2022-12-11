const router = require("express").Router();
const patients = require("./patients-mock");
const fs = require("fs");
const dicomParser = require("dicom-parser");

router.post("/", async (req, res) => {
  const date = req.body;

  console.log("Ripa request object", date);
  const filteredPatients = patients.filter(
    (p) => p.start.startsWith(date) || date === null || date === undefined
  );
  res.status(200).send(patients);
});

router.get("/images/:accession", async (req, res) => {
  const accession = req.params.accession;

  const path = `./images/${accession}.dcm`;
  console.log("Fetching image", accession, path);
  const dicomFileBytes = fs.readFileSync(path);
  const dataSet = dicomParser.parseDicom(dicomFileBytes);
  const pixelDataElement = dataSet.elements.x7fe00010;
  const pixelData = new Uint16Array(
    dataSet.byteArray.buffer,
    pixelDataElement.dataOffset,
    pixelDataElement.length / 2
  );
  console.log("Pixel data", pixelData.length);
  res.status(200).send(pixelData);
});

router.get("/cpr/:cpr", async (req, res) => {
  const cpr = req.params.cpr;

  console.log("Fetching patient by cpr", cpr);
  const patientStudies = patients.filter((p) => p.cpr === cpr);
  res.status(200).send(patientStudies);
});

module.exports = router;
