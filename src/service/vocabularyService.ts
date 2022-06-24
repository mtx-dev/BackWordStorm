import VocabularyModel from "../models/vocabularyModel";
import ApiError from "../exeptions/api-error";
import { Types } from "mongoose";

class vocabularyService {
  async getVocabulary(userId: Types.ObjectId) {
    const vocabulary = await VocabularyModel.find({ user: userId });
    console.log("Voc service: get - ", vocabulary);
    if (!vocabulary) {
      throw ApiError.BadRequest("Vocabulary is empty");
    }
    return vocabulary;
  }

  async addWord(userId: Types.ObjectId) {
    const vocabulary = await VocabularyModel.find({ user: userId });
    console.log("Voc service: get - ", vocabulary);
    if (!vocabulary) {
      throw ApiError.BadRequest("Vocabulary is empty");
    }
    return vocabulary;
  }

  async updateWord(userId: Types.ObjectId) {
    const vocabulary = await VocabularyModel.find({ user: userId });
    console.log("Voc service: get - ", vocabulary);
    if (!vocabulary) {
      throw ApiError.BadRequest("Vocabulary is empty");
    }
    return vocabulary;
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
