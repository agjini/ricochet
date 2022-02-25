import sharp from "sharp";
import BackBlazeB2 from "backblaze-b2";
import crypto from "crypto";
import { UploadFile, UploadService } from "../api";

const bucketName = process.env.B2_BUCKET_NAME as string;
const bucketId = process.env.B2_BUCKET_ID as string;
const id = process.env.B2_ID as string;
const key = process.env.B2_KEY as string;

const b2 = new BackBlazeB2({
  applicationKeyId: id,
  applicationKey: key
});

export class UploadServiceImpl implements UploadService {

  async delete(path: string, file?: string): Promise<void> {
    await b2.authorize();
    const files = await UploadServiceImpl.listFiles(`${path}${file ? `/${file}` : ""}`);
    for (const f of files) {
      await b2.deleteFileVersion({ fileId: f.fileId, fileName: f.fileName });
    }
  }

  async list(path: string): Promise<string[]> {
    const { downloadUrl } = (await b2.authorize()).data as { downloadUrl:string, authorizationToken:string };
    const files = await UploadServiceImpl.listFiles(path);
    return files.map((f) => `${downloadUrl}/file/${bucketName}/${f.fileName}`);
  }

  async uploadBuffer(path: string, filename:string, data: Buffer): Promise<string> {
    const hash = crypto.createHash("sha1")
      .update(data)
      .digest("hex");
    const fullFileName = `${path}/${filename}`;
    const { downloadUrl } = (await b2.authorize()).data as { downloadUrl:string, authorizationToken:string };
    const existing = await UploadServiceImpl.getFile(fullFileName);
    if (!existing || existing.hash !== hash) {
      const { uploadUrl, authorizationToken } = await UploadServiceImpl.getUploadUrl();
      await b2.uploadFile({ uploadUrl,
        uploadAuthToken: authorizationToken,
        data,
        hash,
        fileName: fullFileName });
    }
    return `${downloadUrl}/file/${bucketName}/${fullFileName}`;
  }

  async upload(path: string, files: UploadFile[]): Promise<string[]> {
    const urls:string[] = [];
    for (const file of files) {
      const output = await sharp(file.path)
        .resize({
          height: 1080,
          withoutEnlargement: true
        })
        .jpeg({ quality: 90 })
        .toBuffer();
      urls.push(await this.uploadBuffer(path, file.filename, output));
    }
    return urls;
  }

  private static async getUploadUrl(): Promise<{ uploadUrl: string, authorizationToken: string }> {
    return (await b2.getUploadUrl({ bucketId })).data;
  }

  private static async getFile(path: string): Promise<{ fileId:string, fileName: string, hash: string } | null> {
    const existing = await UploadServiceImpl.listFiles(path, 1);
    if (existing.length > 0) {
      return existing[0];
    }
    return null;
  }

  private static async listFiles(path: string, maxFileCount:number = 100): Promise<{ fileId:string, fileName: string, hash: string }[]> {
    const { files } = (await b2.listFileNames({ bucketId, startFileName: path, maxFileCount, delimiter: "", prefix: path })).data;
    return files.map((f) => ({ fileId: f.fileId, fileName: f.fileName, hash: f.contentSha1 }));
  }

}
