var ServerAPI = {};
ServerAPI.baseURL = 'http://localhost:80/api';///'http://affsoft.ca/api';
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
