var DataFrame = require('dataframe-js').DataFrame;

const express = require('express');
const app = express();

const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const parsed_results = [];
var r = [];

var aggregate_by_gender = require('./data_aggregators/gender_aggregator.js');
 
fs.createReadStream('data/final_dataset.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    
    for (let row of results) {
    	let obj = {};
    	obj.name = row.name;
    	obj.renumeration = Number(row.renumeration.replace(/,/g, ""));
    	obj.expenses = Number(row.expenses.replace(/,/g, ""));
    	obj.department = row.department;

    	if (row.gender === "mostly_female") {
    		obj.gender = "female";
    	}
    	else if (row.gender === "mostly_male") {
    		obj.gender = "male";
    	}
    	else if (row.gender === "andy") {
    		obj.gender = "androgynous";
    	} else {
    		obj.gender = row.gender;
    	}

    	parsed_results.push(obj);
    }

    const df = new DataFrame(parsed_results, ['name', 'renumeration', 'expenses', 'position', 'department', 'gender']);

    r = aggregate_by_gender(df);
    console.log(r);
  });


app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html', {results: r});
});

app.listen(8080, () => {
  console.log('====RUNNING ON PORT 8080==== \n')
});

