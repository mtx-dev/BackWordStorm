import { Router } from "express";
import userController from "../controllers/user-controller";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware";

import dictionaryController from "../controllers/dictionaryController";
import vocabularyController from "../controllers/vocabularyController";

const router = Router();

router.get("/", (req, res) => {
  res.send("WordStorm Function endpoint: /api");
});
router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

router.get(
  "/dictionaryary/search",
  authMiddleware,
  dictionaryController.search
);
router.get(
  "/dictionaryary/fake-words",
  authMiddleware,
  dictionaryController.fakeWords
);
router.get(
  "/dictionaryary/fake-translations",
  authMiddleware,
  dictionaryController.fakeTranslations
);

router.get("/vocabulary", authMiddleware, vocabularyController.getVocabulary);
router.post("/vocabulary", authMiddleware, vocabularyController.addWord);
router.delete("/vocabulary", authMiddleware, vocabularyController.delete);
router.patch("/vocabulary/update", authMiddleware, vocabularyController.update);
router.patch(
  "/vocabulary/updates",
  authMiddleware,
  vocabularyController.updates
);

export default router;
