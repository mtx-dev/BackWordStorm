import VocabularyModel, { IVocabularyModel } from "../models/vocabularyModel";
import ApiError from "../exeptions/api-error";
import { Types } from "mongoose";
import { VocabularyWordDto } from "../dtos/vocabularyDto";

class vocabularyService {
  public async getVocabulary(userId: Types.ObjectId) {
    const vocabulary = await VocabularyModel.find({ user: userId });
    console.log("Voc service: get - ", vocabulary);
    if (!vocabulary) {
      throw ApiError.BadRequest("Vocabulary is empty");
    }
    const vocabularyDto = vocabulary.map((item) => new VocabularyWordDto(item));

    return vocabularyDto;
  }

  public async addWord(
    userId: Types.ObjectId,
    word: string,
    translation: string,
    note?: string
  ) {
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

  public async updateWord(
    userId: Types.ObjectId,
    wordUpdates: Partial<IVocabularyModel>
  ) {
    console.log("wordUpdates", wordUpdates);

    const { id, ...updates } = wordUpdates;

    const result = await VocabularyModel.updateOne(
      {
        user: userId,
        _id: id,
      },
      { $set: { ...updates } }
    );
    console.log("Voc service: upd - ", result);
    if (!result) {
      throw ApiError.BadRequest("Update fail");
    }
    return result;
  }

  public async updateWords(
    userId: Types.ObjectId,
    wordsUpdates: Array<Partial<IVocabularyModel> & Record<"id", string>>
  ) {
    const updates = wordsUpdates.map((word) => getBulkUpdateItem(userId, word));
    const result = await VocabularyModel.bulkWrite(updates);

    console.log("Voc service: upd - ", result);
    if (!result) {
      throw ApiError.BadRequest("Updates fail");
    }
    return result;
  }

  public async deleteWord(userId: Types.ObjectId, wordId: Types.ObjectId) {
    const result = await VocabularyModel.deleteOne({
      user: userId,
      _id: wordId,
    });
    console.log("Voc service: del - ", result);
    if (!result) {
      throw ApiError.BadRequest("Delete fail");
    }
    return result;
  }
}

export default new vocabularyService();

const getBulkUpdateItem = (
  userId: Types.ObjectId,
  data: Partial<IVocabularyModel>
) => {
  const { id, ...rest } = data;
  return {
    updateOne: {
      filter: { user: userId, _id: id },
      update: { ...rest },
    },
  };
};
