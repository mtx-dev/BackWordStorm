import VocabularyModel, { IVocabularyModel } from "../models/vocabularyModel";
import ApiError from "../exeptions/api-error";
import { Types } from "mongoose";
import { VocabularyWordDto } from "../dtos/vocabularyDto";

class vocabularyService {
  async getVocabulary(userId: Types.ObjectId) {
    const vocabulary = await VocabularyModel.find({ user: userId });
    console.log("Voc service: get - ", vocabulary);
    if (!vocabulary) {
      throw ApiError.BadRequest("Vocabulary is empty");
    }
    const vocabularyDto = vocabulary.map((item) => new VocabularyWordDto(item));

    return vocabularyDto;
  }

  async addWord(userId: Types.ObjectId, word, translation, note) {
    const wordData = {
      user: userId,
      word,
      translation,
      note,
    };
    const candidate = await VocabularyModel.findOne(wordData);
    console.log("candidate", candidate);
    if (candidate) {
      throw ApiError.BadRequest(`Word ${word} already exist`);
    }
    const vocabularyWord = await VocabularyModel.create(wordData);
    console.log("Voc service: ADD - ", vocabularyWord);
    return vocabularyWord;
  }

  async updateWord(
    userId: Types.ObjectId,
    wordUpdates: Partial<IVocabularyModel>
  ) {
    const result = await VocabularyModel.findOneAndUpdate(
      {
        user: userId,
        word: wordUpdates.word,
        translation: wordUpdates.translation,
      },
      { $set: { ...wordUpdates } }
    );
    console.log("Voc service: upd - ", result);
    if (!result) {
      throw ApiError.BadRequest("Vocabulary is empty");
    }
    return result;
  }

  async updateWords(userId: Types.ObjectId) {
    const vocabulary = await VocabularyModel.find({ user: userId });
    console.log("Voc service: get - ", vocabulary);
    if (!vocabulary) {
      throw ApiError.BadRequest("Vocabulary is empty");
    }
    return vocabulary;
  }

  async deleteWords(userId: Types.ObjectId) {
    const vocabulary = await VocabularyModel.find({ user: userId });
    console.log("Voc service: get - ", vocabulary);
    if (!vocabulary) {
      throw ApiError.BadRequest("Vocabulary is empty");
    }
    return vocabulary;
  }
}

export default new vocabularyService();
