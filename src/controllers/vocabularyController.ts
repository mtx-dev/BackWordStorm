import ApiError from "../exeptions/api-error";
import vocabularyService from "../service/vocabularyService";
import { UserDto } from "../dtos/user-dto";
import { Request } from "express";
import { IVocabularyModel } from "../models/vocabularyModel";

class VocabularyController {
  async getVocabulary(req, res, next) {
    try {
      const userData = res.locals.user as UserDto;
      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }
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
      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }
      const { word, translation, note } = req.body;
      console.log("body", word, translation, note);
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
      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }
      const { word } = req.body;
      console.log(word);
      // TODO chek empty property
      const updatedWord = await vocabularyService.updateWord(
        userData.id,
        word as IVocabularyModel
      );
      console.log("======== VocabularyController update");
      res.json(updatedWord);
    } catch (error) {
      next(error);
    }
  }

  async updates(req, res, next) {
    try {
      // TODO cheack on norm str
      const { words } = req.body;
      // Pro,ice all or 1 request????

      // const {refreshToken} = req.cookies;
      // const token = await userService.logout(refreshToken);
      // res.clearCookie('refreshToken');
      // console.log('======== logout');
      // res.json(token);
    } catch (error) {
      next(error);
    }
  }
}

export default new VocabularyController();
