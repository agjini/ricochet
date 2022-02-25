import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { ResourceNotFoundError, UnauthorizedError, ValidationError } from "./exception";
import {  UploadFile } from "../api";

export function onError<Req, Res extends NextApiResponse>(err: any, _: Req, res: Res) {
  if (err instanceof ResourceNotFoundError) {
    res.status(404).send(err.message || "");
  } else if (err instanceof UnauthorizedError) {
    res.status(401).send(err.message || "");
  } else if (err instanceof ValidationError) {
    res.status(400).send({ errors: err.errors });
  } else {
    console.error("An error occured", err);
    res.status(500).send(err.message || "");
  }
}
//
// export async function checkAuth(req: NextApiRequest): Promise<AuthUser> {
//   const a = req.headers.authorization;
//   return userService.isValid(a);
// }

export interface RequestWithFile extends NextApiRequest {
  file: UploadFile;
}

export interface RequestWithFiles extends NextApiRequest {
  files: UploadFile[];
}

export const upload = multer({
  storage: multer.diskStorage({
    filename: (_, file, cb) => {
      if (file.mimetype.startsWith("image")
            || file.mimetype === "text/csv"
            || file.mimetype === "application/zip"
            || file.mimetype === "application/pdf") {
        cb(null, file.originalname);
      } else {
        throw new ValidationError({ file: ["Upload an image, a csv or a zip."] });
      }
    }
  })
});
