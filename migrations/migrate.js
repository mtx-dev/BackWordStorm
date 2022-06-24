require("dotenv").config();
const {
  ENGLISH_DICTIONARY_COLLECTION,
  RUSSIAN_DICTIONARY_COLLECTION,
  VOCABULARY_COLLECTION,
} = require("../src/config");

const { kMaxLength } = require("buffer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const {
  EngDictionaryModel,
  RusDictionaryModel,
} = require("../src/models/dictionaryModel");
const VocabularyModel = require("../src/models/vocabularyModel");

const ENGLISH_DICTIONARY_PATH = "englishDictionary.json";
const RUSSIAN_DICTIONARY_PATH = "russianDictionary.json";
const VOCABULARY_PATH = "vocabulary.json";

const flow = [
  {
    name: "English Dictionary",
    path: ENGLISH_DICTIONARY_PATH,
    model: EngDictionaryModel,
    collection: ENGLISH_DICTIONARY_COLLECTION,
  },
  {
    name: "Russain Dictionary",
    path: RUSSIAN_DICTIONARY_PATH,
    model: RusDictionaryModel,
    collection: RUSSIAN_DICTIONARY_COLLECTION,
  },
  {
    name: "Vocabulary",
    path: VOCABULARY_PATH,
    model: VocabularyModel,
    collection: VOCABULARY_COLLECTION,
  },
];

const arg = process.argv[2];
const connectionStauses = [
  "disconnected",
  "connected",
  "connecting",
  "disconnecting",
];
mongoose.connection.on("error", console.error);

const connectionStatus = () => {
  console.log("Satus:", connectionStauses[mongoose.connection.readyState]);
};

const readJsonFile = (path) => {
  try {
    const fd = fs.openSync(path, "r");
    const rawdata = fs.readFileSync(fd);
    fs.closeSync(fd);
    return JSON.parse(rawdata);
  } catch (e) {
    console.error("Error:", e);
  }
};

const upCollection = async (name, collectionPath, model) => {
  console.log("==== MIGRATE ===== ", name, " Collection");
  console.log("Start Reading...");
  const collection = readJsonFile(path.resolve(__dirname, collectionPath));

  if (!collection?.length) {
    throw new Error("No records");
  }

  console.log("Read records", collection.length);

  const mappedCollection = collection
    .filter((i, idx) => idx < 50)
    .map((word) => {
      return {
        insertOne: {
          document: word,
        },
      };
    });

  const blocks = [];
  const blockSize = 10000;

  for (
    let index = 0;
    index <= Math.floor(mappedCollection.length / blockSize);
    index++
  ) {
    const start = index * blockSize;
    const end =
      (index + 1) * blockSize > mappedCollection.length
        ? mappedCollection.length
        : (index + 1) * blockSize;
    blocks[index] = mappedCollection.slice(start, end);
  }
  console.log("Splited to ", blocks.length, " blocks");

  console.log("Start connect...");
  await mongoose.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (error) => console.error(error)
  );

  connectionStatus();

  try {
    let i = 0;
    let response = { ok: 1 };
    const amoutBlocks = blocks.length;

    while (i < amoutBlocks && response.ok) {
      response = await model.bulkWrite(blocks[i]);
      console.log(
        `Saved ${i + 1}/${amoutBlocks} blocks - ${response.nInserted} items`
      );
      i++;
    }

    if (!response.ok) throw new Error(`Migration was failed on block ${i}`);
    console.log("======> ", name, " created\n");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    connectionStatus();
    console.log("\n");
  }
};

const drop = async () => {
  console.log(" --- Drop all collections ---");
  await mongoose.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (error) => console.error(error)
  );

  mongoose.connection.once("open", async function () {
    connectionStatus();
    try {
      for (base of flow) {
        await mongoose.connection.db.dropCollection(base.collection);
        console.log("\n", base.name, " dropped \n");
      }
    } catch (error) {
      mongoose.disconnect();
      console.error(err);
      return;
    } finally {
      await mongoose.disconnect();
      connectionStatus();
    }
  });
};

const upCollections = async () => {
  for (base of flow) {
    await upCollection(base.name, base.path, base.model);
  }
};

const commands = {
  up: async () => upCollections(),
  drop: drop,
};

if (!(arg in commands)) {
  console.log("Wrong command ", arg);
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
