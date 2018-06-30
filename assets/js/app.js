if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('serviceworker.js').then(function(){
		console.log('Serviceworker Registered!');
	}).catch(function(error){
		console.log('Registration failed, error: ', error);
	})
}
else{
	console.log('Service worker not supported.');
}

const dbPromise = idb.open('currencyDB', 1, function (db) {
	if (!db.objectStoreNames.contains('rates')) {
		db.createObjectStore('rates', {keyPath: 'id'});
	}
})
// Create HTML element
function createElement(element){
	return document.createElement(element);
}

// Set Element's class/ID attributes

function setAttributes(element, name, value){
	return element.setAttribute(name, value);
}

// Append to the dropdown
function appendToParent(parent, child){
	return parent.appendChild(child);
}

function readAllData(st) {
  	return dbPromise
    .then(function(db) {
      	var tx = db.transaction(st, 'readonly');
      	var store = tx.objectStore(st);
      	return store.getAll();
    });
}

function readKey(st, key) {
  	return dbPromise
    .then(function(db) {
      	var tx = db.transaction(st, 'readonly');
      	var store = tx.objectStore(st);
      	return store.getKey(key);
      	//return store.getAll();
    });
}

function getAllCurrency(){
	const select = document.getElementById('currencies');
	const select2 = document.getElementById('currencies2');
	const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
	fetch(url)
	.then(response => response.json())
	.then(function(data){
		let currencies = data.results;
		for(currency in currencies){
			//console.log(currencies[currency]);
			let currencyNames = currencies[currency];
			let option = createElement('option');
				option2 = createElement('option');
				option.value = `${currencyNames.id}`;
				option2.value = `${currencyNames.id}`;
				option.text = `${currencyNames.currencyName} ( ${currencyNames.currencySymbol} )`;
				option2.text = `${currencyNames.currencyName} ( ${currencyNames.currencySymbol} )`;
			appendToParent(select, option);
			appendToParent(select2, option2);
		}
	})
	.catch(function(err){
		console.log(JSON.stringify(err));
	});
}

function convertCurrency(){
	let displayResult = document.getElementById('convertedResult');
	const addForm = document.forms['currency_converter'];
	addForm.addEventListener('submit', (e) => {
	  	e.preventDefault();
	  	const formData = new FormData(e.target);
	  	let fromCurrency = formData.get('from');
	  	let toCurrency = formData.get('to');
	  	fromCurrency = encodeURIComponent(fromCurrency);
		toCurrency = encodeURIComponent(toCurrency);
	  	let amount = formData.get('amount');
	  	const query = fromCurrency + '_' + toCurrency;
		const url = 'https://free.currencyconverterapi.com/api/v5/convert?q='+query+'&compact=ultra';
		let networkDataReceived = false;
		fetch(url)
		  .then(function(res) {
		    return res.json();
		  })
		  .then(function(data) {
		    networkDataReceived = true;
			dbPromise.then(db => {
				const tx = db.transaction('rates', 'readwrite');
			    const store = tx.objectStore('rates');
				store.put({
			      	rate: data,
			      	userData: `${fromCurrency}_${toCurrency}`,
			      	id: `${fromCurrency}_${toCurrency}`
			    })
			    return tx.complete;
			})
		    console.log('From web', data);
		    let ratio = data[query];
		    let totalAmount = amount * ratio;  
		    console.log(totalAmount);
		    displayResult.value = totalAmount;
		  });
			/*if ('indexedDB' in window) {
		  		readAllData('rates')
		    	.then(function(data) {
		      	if (!networkDataReceived) {
		        	//console.log('From cache', data);
		        	displayResult.value = "";
		        	for(let i=0; i < data.length; i++){
		        		let dbData = data[i];
		        		if(dbData.length === 0) return;
		        		for(key in dbData){
		        			console.log(dbData[key][query]);
		        		}
		        	}
		        	let ratio = dbData[key][query];
				    let totalAmount = amount * ratio; 
				    displayResult.value = totalAmount;
		      	}
		    });
		}*/
	});
}
getAllCurrency();