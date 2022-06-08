require('dotenv').config();
const { kMaxLength } = require('buffer');
const fs = require('fs');
const path = require("path");
const mongoose = require('mongoose');
const DictionaryModel = require('../models/dictionaryModel');

const ENGLISH_DICTIONARY_PATH = 'englishDictionary.json';

const arg = process.argv[2];
const connectionStauses = [
	'disconnected',
	'connected',
	'connecting',
	'disconnecting',
];
mongoose.connection.on('error', console.error);

const connectionStatus = () => {
	console.log('Satus:', connectionStauses[mongoose.connection.readyState]);
}

const readJsonFile = (path) => {
	try {
		const fd = fs.openSync(path,"r");
		const rawdata = fs.readFileSync(fd);
		fs.closeSync(fd);
		return JSON.parse(rawdata);
	} catch (e) {
		console.error('Error:', e);
	}
}

const up = async () => {
	const dictionary = readJsonFile(path.resolve(__dirname, ENGLISH_DICTIONARY_PATH));

	if (!dictionary?.length) {
		throw new Error('No records')
	}

	console.log('Read records', dictionary.length);

	const mappedDictionary = dictionary.map(word => {
		return {
			insertOne: {
				document: word
			}
		};
	});
	console.log('Start connect');

	const dictinaryBlocks = [];
	const blockSize = 10000;

	for (let index = 0; index <= Math.floor(mappedDictionary.length / blockSize); index++) {
		const start = index * blockSize;
		const end = (index + 1) * blockSize > mappedDictionary.length ? 
		mappedDictionary.length :
			(index + 1) * blockSize
		dictinaryBlocks[index] = mappedDictionary.slice(start, end);
	}
	console.log('Split to ', dictinaryBlocks.length, ' blocks');

	await mongoose.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	}, (error) => console.error(error))

	connectionStatus(); 

	try {
		let i = 0;
		let response = { ok: 1 };
		const amoutBlocks = dictinaryBlocks.length;
		
		while (i < amoutBlocks && response.ok ) {
			response = await DictionaryModel.bulkWrite(dictinaryBlocks[i]);
			console.log(`Saved ${i + 1}/${amoutBlocks} blocks - ${response.nInserted} items`);
			i++;
		}

		if (!response.ok) throw new Error(`Migration was failed on block ${i}`);
		console.log('\nDictionary created\n');
		
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await mongoose.disconnect(); 
		connectionStatus(); 
	}
}

const drop = async() => {
	await mongoose.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	}, (error) => console.error(error));

	mongoose.connection.once('open', function () {
		connectionStatus(); 
		mongoose.connection.db.dropCollection(
			"dictionary", async function(err) {
			if (err)  {
			   mongoose.disconnect();  
			   console.error(err);
			   return;
			}
			console.log('\nDictionary dropped\n');
			await mongoose.disconnect(); 
			connectionStatus(); 
		});
	});
}

const commands = {
	up: up,
	drop: drop,
}

if (!(arg in commands)) {
	console.log('Wrong command ', arg);
	process.exit(127);
}

commands[arg]();




	// DictionaryModel.bulkWrite(d, async function(err,  res) {
	// 	if (err)  {
	// 	   mongoose.disconnect();  // Make sure to close connection
	// 	   console.error(err);
	// 	   return;
	// 	}
	// 	console.log('\nDictionary created\n');
	// 	console.log(res.insertedCount, res.modifiedCount, res.deletedCount);
	// 	await mongoose.disconnect(); // Make sure to close connection
	// 	connectionStatus(); 
	// });

	// DictionaryModel.create(d, async function(err) {
	// 	if (err)  {
	// 	   mongoose.disconnect();  // Make sure to close connection
	// 	   console.error(err);
	// 	   return;
	// 	}
	// 	console.log('\nDictionary created\n');
		// await mongoose.disconnect(); // Make sure to close connection
		// connectionStatus(); 
	// });