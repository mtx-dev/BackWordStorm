const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

router.get('/dictionaryary/search', authMiddleware, dictionaryController.search);
router.get('/dictionaryary/fake-words', authMiddleware, dictionaryController.fakeWords);
router.get('/dictionaryary/fake-translations', authMiddleware, dictionaryController.fakeTranslations);

router.get('/vocabulary', authMiddleware, vocabularyController.getVocabulary);
router.post('/vocabulary/add', authMiddleware, vocabularyController.addWord);
router.patch('/vocabulary/update', authMiddleware, vocabularyController.update);
router.put('/vocabulary/updates', authMiddleware, vocabularyController.updates);

module.exports = router;