import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
// import  mailService from'./mail-service';
import tokenService from "./token-service";
import { UserDto } from "../dtos/user-dto";
import ApiError from "../exeptions/api-error";
import { IUser } from "../interfaces/IUser";
import { Types } from "mongoose";

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email: ${email} already exist`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
      settings: {},
    });
    // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto.toPayload() });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("User with this email did not find");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect email or password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validationRefreshToken(refreshToken);
    const tokenFromDb = tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = UserModel.find();
    return users;
  }

  async updateUser(userId: Types.ObjectId, userUpdates: Partial<IUser>) {
    if (!userUpdates) {
      throw ApiError.BadRequest(`Updates is epmty`);
    }
    const ALLOWED_USER_FIELDS_TO_UPDATE = ["settings"];
    const allowedUserUpdates = Object.fromEntries(
      Object.entries(userUpdates).filter((entry) =>
        ALLOWED_USER_FIELDS_TO_UPDATE.includes(entry[0])
      )
    );

    const user = await UserModel.updateOne(
      {
        _id: userId,
      },
      { $set: { ...allowedUserUpdates } }
    );

    return { user };
  }
}

export default new UserService();
