// https://expressjs.com/
const express = require('express');
const router = express.Router();

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

router.post('/preview', (req, res) => {
  // Delete after debugging
  console.log(`Giving to Charity: ${req.body.givingToCharity}`);
  console.log(`Remains Clause: ${req.body.remainsClause}`);

  res.render('preview', {
    articleNumber: 0,
    testatorName: req.body.testatorName,
    testatorCounty: req.body.testatorCounty,
    testatorState: req.body.testatorState,
    givingToCharity: Boolean(req.body.givingToCharity),
    remainsClause: Boolean(req.body.remainsClause),
    day: req.body.day,
    month: req.body.month,
    year: req.body.year
  });
})

// router.get('/print', (req, res) => {
//   const PDFDocument = require('pdfkit');

//   const doc = new PDFDocument({ 
//     size: 'A4',
//     font: 'public/fonts/Merriweather.ttf'
//   });

//   res.writeHead(200, {
//     'Content-Type': 'application/pdf',
//     'Content-Disposition': 'inline'
//   });

//   doc.pipe(res);

//   doc
//     .fontSize(16)
//     .text('Hello world');
  
//   doc.end();
// })

module.exports = router;