import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { ResourceNotFoundError, UnauthorizedError, ValidationError, UploadFile, ListOptions } from "../api";

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

export function parseListOptions<T>(req: NextApiRequest): ListOptions<T> {
  return {
    filter: req.query.filter ? JSON.parse(req.query.filter as string) : undefined,
    skip: req.query.skip ? parseInt(req.query.skip as string, 10) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    search: req.query.search as string,
    sort: req.query.sort ? JSON.parse(req.query.sort as string) : undefined
  };
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
