const {Schema, model} = require('mongoose');

const DictionarySchema = new Schema({
    word: {type: String, unique: true, required: true},
    translations: [{ type: String }],
});

export const EngDictionaryModel = model('Dictionary', DictionarySchema, ENGLISH_DICTIONARY_COLLECTION);
export const RusDictionaryModel = model('Dictionary', DictionarySchema, RUSSIAN_DICTIONARY_COLLECTION);
