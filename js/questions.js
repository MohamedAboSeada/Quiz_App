const form = document.getElementById('add');

// autofocus first input
const qt = document.getElementById('qtitle');
qt.focus();

const message = document.querySelector('.message');

form.addEventListener('submit', async function (e) {
	// extract Data
    e.preventDefault();
	let formData = new FormData(e.target);

	let jsonData = {};
	let Options = [];
	for (let [key, value] of formData.entries()) {
		if (key === 'Option') {
			Options.push(value);
		} else {
			jsonData[key] = value;
		}
	}
	jsonData['Options'] = Options;

	// send the data to the server
	const response = await fetch('/submit', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ jsonData }), // Directly send jsonData object
	});
	const data = await response.json();
    if(data){
        message.classList.add('pop');
        setTimeout(_=>{
            message.classList.remove('pop');
        },5000);
    }
});
