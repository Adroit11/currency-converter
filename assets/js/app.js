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
	  	let amount = formData.get('amount');

		const query = fromCurrency + '_' + toCurrency;
		const url = 'https://free.currencyconverterapi.com/api/v5/convert?q='+query+'&compact=ultra';
		fromCurrency = encodeURIComponent(fromCurrency);
		toCurrency = encodeURIComponent(toCurrency);
		fetch(url)
		.then(response => response.json())
		.then(data => {
			const ratio = data[query];
		    const totalAmount = amount * ratio;  
		    console.log(totalAmount);
		    displayResult.value = totalAmount;
		})
		.catch(function(err){
			console.log(JSON.stringify(err));
		})
	});
}
getAllCurrency();
//convertCurrency(10, 'USD', 'NGN');  

