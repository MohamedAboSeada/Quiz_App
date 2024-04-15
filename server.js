const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// POST route to handle form submission
app.post('/submit', (req, res) => {
	const { jsonData } = req.body;

	// Load existing data from JSON file
	let existingData = [];
	try {
		existingData = JSON.parse(fs.readFileSync('./js/q.json', 'utf8'));
	} catch (error) {
		console.error('Error reading JSON file:', error);
	}

	// Add new data
	existingData.push(jsonData);

	// Write updated data to JSON file
	fs.writeFile(
		'./js/q.json',
		JSON.stringify(existingData, null, 2),
		'utf8',
		(err) => {
			if (err) {
				console.error('Error writing JSON file:', err);
				res.status(500).json({ error: 'Error saving data' });
			} else {
				console.log('Data saved successfully');
				res.json({ message: 'Data saved successfully' });
			}
		}
	);
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
