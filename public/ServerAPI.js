var ServerAPI = {};
ServerAPI.baseURL = 'http://localhost:80/api';///'http://affsoft.ca/api';
ServerAPI.currentSearchResults = [];
ServerAPI.jsonListOfFavourites = [];
//test ;)
ServerAPI.xmlRequest = function(type, req, to){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(this.readyState === 4 && this.status === 200){
			to(JSON.parse(this.response));
		}
	};

	xhr.open(type, ServerAPI.baseURL + req, true);
	xhr.send(null);
};

ServerAPI.decodeHtml = function(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
};

ServerAPI.isAFav = function(indexNumber){
	for(var i = 0;i < ServerAPI.jsonListOfFavourites.length;i++){
		if(ServerAPI.jsonListOfFavourites[i].indexNum === indexNumber){
			return i;
		}
	}
	return -1;
};

ServerAPI.searchResultWithID = function(jsonOfResults, indexNumber){
	for(var i = 0;jsonOfResults.length;i++){
		if(jsonOfResults[i].indexNum === indexNumber) return jsonOfResults[i];
	}
	return null;
};

ServerAPI.bindKeyListener = function(){
	var searchBarElement = document.getElementById('searchInput');
	searchBarElement.value = ""; //sometimes cached values remain here
	searchBarElement.onkeydown = function(e){
		if(e.keyCode == 13){
			searchBarElement.value = searchBarElement.value.trim();
			searchBarElement.value = searchBarElement.value.replace('\n', '');
			ServerAPI.searchRequest();
		}else if(e.keyCode === 8 || e.keyCode === 46){
			//Clear if search bar is cleared (aesthetic delay)
			setTimeout(function(){
				if(searchBarElement.value.trim().length < 1)
					document.getElementById('tableContainer').innerHTML = '';
			}, 150);

		}
	};
};

ServerAPI.searchRequest = function(){
	var receiveWasteData = function(data){
		if(!data.error){
			ServerAPI.currentSearchResults = JSON.parse(data.info);
			ServerAPI.renderNewSearchResults(ServerAPI.currentSearchResults, 'tableContainer');
		}else{
			console.log('error: invalid api call');
		}
	};

	var valOfSearchBar = document.getElementById('searchInput').value;
	valOfSearchBar = valOfSearchBar.trim();
	document.getElementById('searchInput').value = valOfSearchBar;

	//userSearch = userSearch.replace(/ /g, '');
	var command = '?cmd=submit_search';
	command += '&search=' + valOfSearchBar;
	ServerAPI.xmlRequest('POST', command, receiveWasteData);
};

ServerAPI.renderNewSearchResults = function(wData, idOftableContainer){
	var tableContainer = document.getElementById(idOftableContainer);
	tableContainer.innerHTML = "";
	//let parser = new DOMParser();
	//var parsedHTML = parser.parseFromString(, 'text/html');
	if(wData.length === 0){
		if(idOftableContainer !== 'favouritesContent') tableContainer.innerHTML = 'No results...';
	}
	else{
		var tableEl = document.createElement('table');
		tableEl.classList.add("raw-table");
		//For each result received from the server's response - I make a row
		//in a <table> and add it to the website
		for(var i = 0;i < wData.length;i++){
			var rowEl = document.createElement('tr');
			var cell1 = document.createElement('td');
			var cell2 = document.createElement('td');
			//Title cell
			var starImg = document.createElement('img');
			starImg.setAttribute('width', '18');
			starImg.setAttribute('height', '18');
			var idValue = 'starID'+wData[i].indexNum;
			starImg.setAttribute('id', idValue);
			//If being rendered in the favourites section
			if(idOftableContainer === 'favouritesContent') starImg.setAttribute('id', idValue + 'f');
			starImg.setAttribute('onclick', "ServerAPI.favouritesAltered(\"" + idValue + "\")");
			if(ServerAPI.isAFav(wData[i].indexNum) !== -1){//If already a fav or not
				//<img id="searchButton" src="magGlass.png" width="50" height="50">
				starImg.setAttribute('src', 'fav.png');
			}
			else{
				starImg.setAttribute('src', 'notfav.png');
			}
			cell1.setAttribute("valign", "top");
			cell1.appendChild(starImg);
			cell1.innerHTML += "  ";
			cell1.innerHTML += ''+wData[i].title;
			//Body cell
			var htmlString = ServerAPI.decodeHtml(''+wData[i].body);
			cell2.setAttribute("valign", "top");
			cell2.classList.add("table-body-cell");
			cell2.innerHTML = htmlString;

			//Add the built row into the table
			rowEl.appendChild(cell1);
			rowEl.appendChild(cell2);
			tableEl.appendChild(rowEl);
		}
		//Finally add the table into the table container on the webpage
		tableContainer.appendChild(tableEl);
	}
};

ServerAPI.favouritesAltered = function(idOfStar, fromFavouritesSection){
	var idNum = -1;
	if(fromFavouritesSection){
		idNum = Number(idOfStar.replace('starID', '').replace('f', ''));
	}
	else{
		idNum = Number(idOfStar.replace('starID', ''));
	}

	//If selected star is already a favourite
	var favIndex = ServerAPI.isAFav(idNum);
	if(favIndex !== -1){
		ServerAPI.jsonListOfFavourites.splice(favIndex, 1);
		ServerAPI.renderNewSearchResults(ServerAPI.currentSearchResults, 'tableContainer');
		ServerAPI.renderNewSearchResults(ServerAPI.jsonListOfFavourites, 'favouritesContent');
	}
	else{
		document.getElementById(idOfStar).setAttribute('src', 'fav.png');
		ServerAPI.jsonListOfFavourites.push(
			ServerAPI.searchResultWithID(ServerAPI.currentSearchResults, idNum)
		);
		//Update the favourites section with new values
		ServerAPI.renderNewSearchResults(ServerAPI.jsonListOfFavourites, 'favouritesContent');
	}
	//console.log('alter: ' + idNum);
};
