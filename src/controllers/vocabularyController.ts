import ApiError from "../exeptions/api-error";
import vocabularyService from "../service/vocabularyService";
import { UserDto } from "../dtos/user-dto";
import { Request } from "express";
import { IVocabularyModel } from "../models/vocabularyModel";

class VocabularyController {
  async getVocabulary(req, res, next) {
    try {
      const userData = res.locals.user as UserDto;

      const vocabulary = await vocabularyService.getVocabulary(userData.id);

      console.log("======== VocabularyController  GET ALL");

      return res.json(vocabulary);
    } catch (error) {
      next(error);
    }
  }

  async addWord(req: Request, res, next) {
    try {
      const userData: UserDto = res.locals.user;
      const { word, translation, note } = req.body;

      // TODO Rework to express validation
      if (!word || !translation) {
        return next(ApiError.BadRequest(`Word and translation are required`));
      }

      const vocabularyItem = await vocabularyService.addWord(
        userData.id,
        word,
        translation,
        note
      );

      console.log("======== VocabularyController  addWord");
      return res.json(vocabularyItem);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const userData = res.locals.user;

      const { word } = req.body;
      // TODO chek empty property
      const updatedWord = await vocabularyService.updateWord(
        userData.id,
        word as Partial<IVocabularyModel>
      );
      console.log("======== VocabularyController update");
      res.json(updatedWord);
    } catch (error) {
      next(error);
    }
  }

  async updates(req, res, next) {
    try {
      const userData = res.locals.user;

      // TODO Add normal request type with updates
      const { words } = req.body;
      console.log("words body", words);
      // TODO chek empty property
      const result = await vocabularyService.updateWords(userData.id, words);
      console.log("======== VocabularyController updatessss");
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const userData = res.locals.user;
      const { id } = req.body;
      // TODO chek empty property
      const result = await vocabularyService.deleteWord(userData.id, id);
      console.log("======== VocabularyController delete");
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new VocabularyController();
