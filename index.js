const express = require('express')
const app = express();

const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const final_results = {};
 
fs.createReadStream('data/test_dataset.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results[0].name);
    
    for (let row of results) {
    	let renumeration = row.renumeration.replace(/,/g, "");
    	final_results[row.name] = Number(renumeration);
    }

    console.log(final_results);
  });

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', (req, res) => {
  res.render('index.html', {final_results: final_results});
});

app.listen(8080, () => {
  console.log('====RUNNING ON PORT 8080====')
});

