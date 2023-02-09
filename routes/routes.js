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

module.exports = router;