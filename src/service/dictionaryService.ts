import ApiError from "../exeptions/api-error";
import { type Model, type Document } from "mongoose";
import {
  EngDictionaryModel,
  RusDictionaryModel,
} from "../models/dictionaryModel";

class dictionaryService {
  public async search(searchString: string) {
    console.log("searchStringlength", searchString.length);
    const result = await EngDictionaryModel.find(
      {
        word: {
          $regex: searchString,
          $options: "i",
        },
      },
      "translations word",
      { limit: 20 }
    );

    return result;
  }

  public async fakeWord(searchString: string, model: Model<Document>) {
    const min = searchString.length > 1 ? searchString.length - 1 : 1;
    const replased = searchString.replace(" ", "]+ [");
    const result = await model.aggregate([
      {
        $match: {
          word: {
            $regex: `^[${replased}]+`,
            $options: "i",
          },
        },
      },
      { $project: { word: 1, length: { $strLenCP: "$word" } } },
      {
        $match: {
          word: { $ne: searchString },
          length: {
            $gte: min,
            $lte: searchString.length + 1,
          },
        },
      },
      { $sample: { size: 3 } },
      { $project: { _id: 0, word: 1 } },
    ]);
    return result;
  }

  public async fakeWords(searchString: string) {
    console.log("searchString", searchString);
    const words = searchString.split(" ");
    console.log("words", words);
    return await this.fakeWord(searchString, EngDictionaryModel);
    // if (words.length === 1)
    // const results = [];

    // for (let index = 0; index < words.length; index++) {
    //   results[index] = await this.fakeWord(words[index], EngDictionaryModel);
    // }
  }

  public async fakeTranslations(searchString: string) {
    return await this.fakeWord(searchString, RusDictionaryModel);
  }
}

export default new dictionaryService();

// const getRandomWords = (arr, max) => {};

// const getRandomWordsByLength = (length, arr, max) => {
//   const amountWords = arr.length;
//   const maxAttempt = Math.max(Math.floor(amountWords / length), 300);
//   const result = [];
//   for (let i = 0; i < maxAttempt; i++) {
//     const index = random(amountWords);
//     if (arr[index].word.length === length) {
//       result.push(arr[index].word);
//     }
//     if (result.length >= max) break;
//   }
//   console.log(result);
//   return result;
// };

// function getFakeWords(rightWord: string, dic: any) {
//   const lessFlag = rightWord.length >= maxFakeLength;
//   const temps = [];
//   let currentLength = rightWord.length;

//   while (temps.length < maxFakeWords) {
//     temps.push(...getRandomWordsByLength(currentLength, dic, maxFakeWords));
//     currentLength = lessFlag ? currentLength - 1 : currentLength + 1;
//     if (currentLength < 2 && lessFlag) break;
//     if (currentLength > 20) break;
//   }
//   console.log("result fake words", temps);
//   return temps;
// }
