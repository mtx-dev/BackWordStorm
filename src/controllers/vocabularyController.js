const userService = require('../service/user-service');
const ApiError = require('../exeptions/api-error');

class VocabularyController {
    async getVocabulary(req, res, next) {
        try {
			// TODO cheack on norm str
            // const errors = validationResult(req);
            const {refreshToken} = req.cookies;
            const userData = await userService.getCurrentUser(refreshToken);
            
            if(!userData) {
                return next(ApiError.UnauthorizedError());
            }
            const vocabulary = await vocabularyService.getAll(userData.id);

            console.log('======== VocabularyController  GET ALL');

            return res.json(vocabulary);
        } catch(error) {
            next(error);
        }
    }

    async addWord(req, res, next) {
        try {
			// TODO cheack on norm str
            const {refreshToken} = req.cookies;
            const userData = await userService.getCurrentUser(refreshToken);
            if(!userData) {
                return next(ApiError.UnauthorizedError());
            }
            const {word, transaltion} = req.body;
            const vocabularyItem = await vocabularyService.add(userData.id, word, transaltion);
            console.log('======== VocabularyController  addWord');
            return res.json(vocabularyItem);
        } catch(error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
			// TODO cheack on norm str
            const {wordUpdates} = req.body;
            // TODO chek empty property
            const updatedWord = await userService.update(wordUpdates);
            console.log('======== logout');
            // res.json(token);
        } catch(error) {
            next(error);
        }
    }

	async updates(req, res, next) {
        try {
			// TODO cheack on norm str
            const {words} = req.body;
            // Pro,ice all or 1 request????

            // const {refreshToken} = req.cookies;
            // const token = await userService.logout(refreshToken);
            // res.clearCookie('refreshToken');
            // console.log('======== logout');
            // res.json(token);
        } catch(error) {
            next(error);
        }
    }
}


module.exports = new VocabularyController();