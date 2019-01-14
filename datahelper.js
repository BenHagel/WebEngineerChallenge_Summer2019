var DataHelper = {};

DataHelper.typoTollerance = 1;

DataHelper.initData = function(){
	DataHelper.wastes = JSON.parse(fs.readFileSync('waste_data/swm_waste_wizard_APR.json'));
	for(var i = 0;i < DataHelper.wastes.length;i++){
		//This process will take up more space in memory but allow for faster
		//search result times
		var keywordsFormatted = DataHelper.wastes[i].keywords.replace(/,/g, '');
		DataHelper.wastes[i].keywordsParsed =
			keywordsFormatted.split(' ');
		//Add index # to all entries (used for favourites later)
		DataHelper.wastes[i].indexNum = i;
	}
};

DataHelper.compileSearchScores = function(req, res, val){
	//Confirm if there is enough information, and not too much information
	//in the search to return anything useful
	val = val.replace(/\s\s+/g, ' ');
	if(val.length < 3 || val.length > 55){sendInvalidAPICall(req, res); return;}
	//Split searches into its keywords
	val = val.split(' ');

	//Compute a score for the # of keywords hit for each DataHelper.wastes element
	var scores = [];

	//Loop through all the possible waste categories
	for(var i = 0;i < DataHelper.wastes.length;i++){
		var matchesToKeyWords = 0.0;
		//Go through the waste's key words
		for(var j = 0;j < DataHelper.wastes[i].keywordsParsed.length;j++){
			for(var k = 0;k < val.length;k++){
				//See if user word matches waste's keyword
				if(DataHelper.leven(val[k], DataHelper.wastes[i].keywordsParsed[j])
					< DataHelper.typoTollerance){
					matchesToKeyWords += 1;
					k = val.length;
				}
			}
		}
		//Calculate the percentage match of the user's search
		var percentMatch = matchesToKeyWords /
			(0.0+DataHelper.wastes[i].keywordsParsed.length);
		scores.push({
			'index': i,
			'perc': percentMatch
		});
	}
	//Custom sort function to bubble highest percent matches to top
	scores.sort(function(a, b){
		return b.perc - a.perc;
	});

	//Of the top eight scores, how many are above 0?
	var scoresToSend = [];
	for(var i = 0;i < Math.min(scores.length, 8);i++){
		if(scores[i].perc > 0) scoresToSend.push(DataHelper.wastes[scores[i].index]);
	}
	//Send JSON of results back in the response to be parsed on the client's side
	res.json({'info': JSON.stringify(scoresToSend)});
};

//Nice implementation of Levenshtein algorithm from:
//https://coderwall.com/p/uop8jw/fast-and-working-levenshtein-algorithm-in-javascript
DataHelper.leven = function(a, b) {
	if(a.length === 0) return b.length;
	if(b.length === 0) return a.length;
	var matrix = [];
	// increment along the first column of each row
	var i;
	for(i = 0; i <= b.length; i++){
		matrix[i] = [i];
	}
	// increment each column in the first row
	var j;
	for(j = 0; j <= a.length; j++){
		matrix[0][j] = j;
	}
	// Fill in the rest of the matrix
	for(i = 1; i <= b.length; i++){
		for(j = 1; j <= a.length; j++){
			if(b.charAt(i-1) == a.charAt(j-1)){
				matrix[i][j] = matrix[i-1][j-1];
			}
			else{
				matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
				Math.min(matrix[i][j-1] + 1, // insertion
				matrix[i-1][j] + 1)); // deletion
			}
		}
	}
	return matrix[b.length][a.length];
};
