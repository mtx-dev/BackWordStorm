import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import tokenModel from "../models/tokenModel";
import { AccessToken, RefreshToken, Tokens } from "../interfaces/Tokens";
import { UserDto } from "../dtos/user-dto";

class TokenService {
  generateTokens(payload): Tokens {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validationAccessToken(token: AccessToken) {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
      ) as UserDto;
      return userData;
    } catch (error) {
      return null;
    }
  }

  validationRefreshToken(token: RefreshToken) {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
      ) as UserDto;
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId: Types.ObjectId, refreshToken: RefreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: RefreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: RefreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
