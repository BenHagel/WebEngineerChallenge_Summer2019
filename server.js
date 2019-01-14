const fs = require('fs');
const express = require('express');
const app = express();
var path = require('path');
const port = 80;

//Load in the datahelper.js code to help with data reading/writing + improved code readability
eval('' + fs.readFileSync('./datahelper.js'));
//Loading all the json at once and pretending it's a database
DataHelper.initData();

//Specify static loading
app.use(express.static(path.join(__dirname + '/public')));

//Give the page
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

//For api calls
app.post('/api', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST');
	handleApi(req, res);
	//sendInvalidAPICall(res, res);
});

//Catch all
app.get('*', function(req, res){
      res.sendFile(path.join(__dirname + '/public/index404.html'));
});


//Start server
app.listen(port);
console.log('Toronto Waste Wizard listening on port ' + port + '!');




function handleApi(req, res){
	//This command
	if(req.query.cmd === 'submit_search'){
		DataHelper.compileSearchScores(req, res, req.query.search);
	}
	//Unrecognized api request
	else{
		sendInvalidAPICall(req, res);
	}
}

function sendInvalidAPICall(req, res){
	res.json({'error': 'Invalid!'});
}
