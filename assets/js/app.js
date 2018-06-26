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
	const select = document.querySelectorAll('.currencies');
	const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
	fetch(url)
	.then(response => response.json())
	.then(function(data){
		let currencies = data.results;
		for(currency in currencies){
			//console.log(currencies[currency]);
			let currencyNames = currencies[currency];
			let option = createElement('option');
				option.value = `${currencyNames.id}`;
				option.text = `${currencyNames.currencyName} (${currencyNames.currencySymbol})`;
			for( let i = 0; i < select.length; i++){
				appendToParent(select[i], option);
			}
		}
	})
	.catch(function(err){
		console.log(JSON.stringify(err));
	});
}

function convertCurrency(amount, fromCurrency, toCurrency){
	const query = fromCurrency + '_' + toCurrency;
	const url = 'https://free.currencyconverterapi.com/api/v5/convert?q='+query+'&compact';
	fromCurrency = encodeURIComponent(fromCurrency);
	toCurrency = encodeURIComponent(toCurrency);
	fetch(url)
	.then(function(response){
		console.log(response);
		return response.json();
	})
	.then(function(data){
		console.log(data);
	})
}
getAllCurrency();
//convertCurrency(10, 'USD', 'NGN');  

