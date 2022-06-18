const { ENGLISH_DICTIONARY_COLLECTION, RUSSIAN_DICTIONARY_COLLECTION } = require ('../config');

const {Schema, model} = require('mongoose');


const DictionarySchema = new Schema({
    word: {type: String, unique: true, required: true},
    translations: [{ type: String }],
});

const EngDictionaryModel = model('Dictionary', DictionarySchema, ENGLISH_DICTIONARY_COLLECTION);
const RusDictionaryModel = model('Dictionary', DictionarySchema, RUSSIAN_DICTIONARY_COLLECTION);

module.exports = {EngDictionaryModel, RusDictionaryModel };
