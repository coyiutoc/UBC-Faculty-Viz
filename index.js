var DataFrame = require('dataframe-js').DataFrame;

const express = require('express');
const app = express();

const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const output_results = {};
const parsed_results = [];

var aggregate_by_gender = require('./data_aggregators/gender_aggregator.js');
 
fs.createReadStream('data/test_dataset.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    
    for (let row of results) {
    	let renumeration = row.renumeration.replace(/,/g, "");
    	output_results[row.name] = Number(renumeration);

    	let obj = {};
    	obj.name = row.name;
    	obj.renumeration = Number(row.renumeration.replace(/,/g, ""));
    	obj.expenses = Number(row.expenses.replace(/,/g, ""));
    	obj.department = row.department;
    	obj.gender = row.gender;

    	parsed_results.push(obj);
    }

    const df = new DataFrame(parsed_results, ['name', 'renumeration', 'expenses', 'position', 'department', 'gender']);

    //console.log("OUTPUT RESULTS: \n" + output_results);
    df.show();

    aggregate_by_gender(parsed_results);
  });


app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html', {final_results: output_results});
});

app.listen(8080, () => {
  console.log('====RUNNING ON PORT 8080==== \n')
});

