const userService = require('../service/user-service');
const ApiError = require('../exeptions/api-error');

class DictionaryController {
    async search(req, res, next) {
        try {
			// TODO cheack on norm str
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error validation', errors));
            }
            const {search} = req.query;
            const searchResluts = await dictionaryService.search(search);

            console.log('======== search', req, searchResluts);

            return res.json(searchResluts);
        } catch(error) {
            next(error);
        }
    }

    async fakeWords(req, res, next) {
        try {
			// TODO cheack on norm str
            const {search} = req.query;

            const searchResluts = await dictionaryService.fakeWords(search);
            console.log('======== fakeWords', searchResluts);
            return res.json(searchResluts);
        } catch(error) {
            next(error);
        }
    }

    async fakeTranslations(req, res, next) {
        try {
            const {search} = req.query;
            const searchResluts = await dictionaryService.fakeTranslations(search);
            console.log('======== fakeTranslations',search, searchResluts );
            res.json(searchResluts);
        } catch(error) {
            next(error);
        }
    }
}


module.exports = new DictionaryController();