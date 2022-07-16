import dictionaryService from "../service/dictionaryService";
import { validationResult } from "express-validator";
import ApiError from "../exeptions/api-error";

class DictionaryController {
  async search(req, res, next) {
    try {
      // TODO cheack on norm str
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return next(ApiError.BadRequest("Error validation", errors));
      // }

      const searchString = req.query.word;
      console.log("DictionaryController search ", searchString, req.query);
      const searchResluts = await dictionaryService.search(searchString);

      console.log("DictionaryController ======== []", searchResluts.length);

      return res.json(searchResluts);
    } catch (error) {
      next(error);
    }
  }

  async fakeWords(req, res, next) {
    try {
      // TODO cheack on norm str
      const searchString = req.query.word;

      console.log("======== fakeWords", searchString);
      const searchResluts = await dictionaryService.fakeWords(searchString);
      console.log("======== fakeWords", searchResluts);
      return res.json(searchResluts);
    } catch (error) {
      next(error);
    }
  }

  async fakeTranslations(req, res, next) {
    try {
      const searchString = req.query.word;

      const searchResluts = await dictionaryService.fakeTranslations(
        searchString
      );
      console.log("======== fakeTranslations", searchString, searchResluts);
      res.json(searchResluts);
    } catch (error) {
      next(error);
    }
  }
}

export default new DictionaryController();
