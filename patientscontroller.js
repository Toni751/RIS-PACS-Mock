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

router.post("/images", async (req, res) => {
  const dicomFile = req.body;

  // This mocks saving the image in the PACS
  fs.writeFile("./images/test.dcm", dicomFile);
  res.status(200).send(pixelData);
});

router.get("/cpr/:cpr", async (req, res) => {
  const cpr = req.params.cpr;

  console.log("Fetching patient by cpr", cpr);
  const patientStudies = patients.filter((p) => p.cpr === cpr);
  res.status(200).send(patientStudies);
});

module.exports = router;
