const {Schema, model} = require('mongoose');

const VocaularySchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    word: {type: String, unique: true, required: true},
    translation: {type: String, required: true},
    status: {
		type: String, 
		required: true,
		enum: ['unknown', 'study', 'learned'],
		default: 'unknown',
	},
    lastSuccessful: {type: Date, default: null},
    attempts: {type: Number, default: 0},
    successfulAttempts: {type: Number, default: 0},
    active: {type: Boolean, default: true},
});

module.exports = model('Vocaulary', VocaularySchema);

