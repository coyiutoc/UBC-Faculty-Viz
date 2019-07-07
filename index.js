var DataFrame = require('dataframe-js').DataFrame;

const express = require('express');
const app = express();

const csv = require('csv-parser')
const fs = require('fs')

var results = [];
var df = null;

var parsed_results = [];
var main_results = [];

var aggregate_by_gender = require('./data_aggregators/gender_aggregator.js');
var aggregate_gender_by_faculty = require('./data_aggregators/faculty_aggregator.js');
var aggregate_gender_by_position = require('./data_aggregators/position_aggregator.js');

fs.createReadStream('data/final_dataset.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    
    for (let row of results) {
    	let obj = {};
    	obj.name = row.name;
    	obj.renumeration = Number(row.renumeration.replace(/,/g, ""));
    	obj.expenses = Number(row.expenses.replace(/,/g, ""));
    	if (row.department === "University of British Columbia Sauder School of Business") {
    		obj.department = "Sauder School of Business";
    	} 
    	else if (row.department === "Irving K. Barber School of Arts & Sciences Unit 7 - UBC Okanagan") {
    		obj.department = "Irving K. Barber School of Arts & Sciences";
    	}
    	else if (row.department === "and Special Education (ECPS) Educational and Counselling Psychology") {
    		obj.department = "Educational and Counselling Psychology";
    	}
    	else {
    		obj.department = row.department;
    	}

    	// if (row.position === "Professor " || row.position === "Pr"){
    	// 	obj.position = "Professor";
    	// } else {
    		obj.position = row.position.trim();
    	//}

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

    df = new DataFrame(parsed_results, ['name', 'renumeration', 'expenses', 'position', 'department', 'gender']);

    main_results = aggregate_by_gender(df);
  });

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html', {results: main_results});
});

app.get("/aggregate/:gender",function(request, response){
    let gender = request.params.gender;

    let dept_result = aggregate_gender_by_faculty(df, gender);
    let pos_result = aggregate_gender_by_position(df, gender);
    let obj = { "gender" : gender, "by_department" : dept_result, "by_position" : pos_result};

    response.send(obj);
});

app.listen(8080, () => {
  console.log('====RUNNING ON PORT 8080==== \n')
});

