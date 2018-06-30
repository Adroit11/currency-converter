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
	const displayResult = document.getElementById('convertedResult');
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
			      	id: `${fromCurrency}_${toCurrency}`
			    });
			    return tx.complete;
			});
		    console.log('From web', data);
		    const ratio = data[query];
		    const totalAmount = (amount * ratio).toFixed(2);  
		    console.log(totalAmount);
		    displayResult.value = totalAmount;
		  });
	});
}
getAllCurrency();