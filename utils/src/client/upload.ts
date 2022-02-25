import { UploadFile, UploadService } from "../api";
import { get, postAs, remove } from "./http";

export class UploadServiceClient implements UploadService {

  list(path: string): Promise<string[]> {
    return get(`/api/upload/${path}`);
  }

  async delete(path: string, file?: string): Promise<void> {
    if (file) {
      await remove(`/api/upload/${path}/${file}`);
    } else {
      await remove(`/api/upload/${path}`);
    }
  }

  upload(path: string, files: UploadFile[]): Promise<string[]> {
    const body = new FormData();
    for (const file of files) {
      body.append("file", file);
    }
    return postAs("/api/upload", { body, bodyAsJson: false, params: { path } });
  }

  // @ts-ignore
  uploadBuffer(path: string, filename: string, data: Buffer): Promise<string> {
    throw new Error("Not available on front side");
  }

}
