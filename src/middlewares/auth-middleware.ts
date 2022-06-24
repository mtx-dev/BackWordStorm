import { type NextFunction, type Request, type Response } from "express";
import ApiError from "../exeptions/api-error";
import tokenService from "../service/token-service";

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validationAccessToken(accessToken);
    if (!userData) {
      next(ApiError.UnauthorizedError());
    }

    res.locals.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
