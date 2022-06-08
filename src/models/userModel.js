const {Schema, model} = require('mongoose');

const SettingsSchema = new Schema({
    allowedQuizes: {type: [String],  required: true, default: ['Translate', 'ReverseTranslate', 'Listen' ,'Spell']},
    language: {type: String, default: 'Russian'},
    allowVioce: {type: Boolean, default: true},
    theme: {type: String, default: 'default'},
});

const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    activationLink: {type: String},
    // TODO: realize Activations
    isActivated: {type: Boolean, default: true},
    settings: {type: SettingsSchema, required: true},
    vocbulary:[{ type: Schema.Types.ObjectId, ref: 'Vocaulary' }],
});

module.exports = model('User', UserSchema);