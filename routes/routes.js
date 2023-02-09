// https://expressjs.com/
const express = require('express');
const router = express.Router();
const { jsPDF } = require("jspdf"); // will automatically load the node version

router.get('/', (req, res) => {  
  // Use FS module to read JSON file
  const fs = require('fs');

  // readFileSync returns a buffer object; synchronous function
  const rawData = fs.readFileSync('sampleData.json');

  // JSON.parse converts a buffer object to a JSON object
  const jsonData = JSON.parse(rawData);

  // JSON.string converts a JSON object to a string
  const jsonString = JSON.stringify(jsonData);

  // Pass the JSON string to the view template
  // View template automatically converts the string to a JSON object
  res.render('index', { 
    jsonString: jsonString
  });
})

router.post('/print', (req, res) => {
  const doc = new jsPDF();
  doc.text("Hello world!", 10, 10);
  doc.save("will.pdf"); // will save the file in the current working directory

  res.contentType('application/pdf');
  res.download('./will.pdf');
})

module.exports = router;