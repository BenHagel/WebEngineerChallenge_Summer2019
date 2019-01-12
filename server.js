const fs = require('fs');
const express = require('express');
const app = express();
var path = require('path');
const port = 80;


//Specify static loading
app.use(express.static(path.join(__dirname + '/public')));

//Give the page
app.get('/', function(req, res){

});

//For api calls
app.post('/api', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST');
	handleApi(req, res, sessionID, ServerHelper.sessions[sessionID].domain);
	sendInvalid(res, res);

});

//Catch all
app.get('*', function(req, res){
      res.sendFile(path.join(__dirname + '/public/index_not_found.html'));
});


app.listen(port);
console.log('Toronto Waste Wizard searcher listening on port ' + port + '!');
