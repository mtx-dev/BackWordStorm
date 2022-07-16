import dotenv from "dotenv";
dotenv.config();
import {
  ENGLISH_DICTIONARY_COLLECTION,
  RUSSIAN_DICTIONARY_COLLECTION,
  VOCABULARY_COLLECTION,
} from "../src/config/index.js";

import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";
import {
  EngDictionaryModel,
  RusDictionaryModel,
} from "../src/models/dictionaryModel.js";
import VocabularyModel from "../src/models/vocabularyModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    // .filter((i, idx) => idx < 50)
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

const dropAll = async () => {
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
      for (let base of flow) {
        await mongoose.connection.db.dropCollection(base.collection);
        console.log("\n", base.name, " dropped \n");
      }
    } catch (error) {
      mongoose.disconnect();
      console.error(error);
      return;
    } finally {
      await mongoose.disconnect();
      connectionStatus();
    }
  });
};

const drop = async (collevtionName) => {
  console.log(" --- Drop  collection ---", collevtionName);
  const collectionIndex = flow.findIndex((c) => c.name === collevtionName);
  if (collectionIndex < 0) {
    console.log("Wrong command ", arg);
    process.exit(127);
  }

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
      await mongoose.connection.db.dropCollection(
        flow[collectionIndex].collection
      );
      console.log("\n", flow[collectionIndex].name, " dropped \n");
    } catch (error) {
      mongoose.disconnect();
      console.error(error);
      return;
    } finally {
      await mongoose.disconnect();
      connectionStatus();
    }
  });
};

const upCollections = async () => {
  for (let base of flow) {
    await upCollection(base.name, base.path, base.model);
  }
};

const commands = {
  up: async () => upCollections(),
  dropAll: dropAll,
  drop: drop,
};
const arg = process.argv[2];
const fistParam = process.argv[3];

if (!(arg in commands)) {
  console.log("Wrong command ", arg);
  process.exit(127);
}

commands[arg](fistParam);
