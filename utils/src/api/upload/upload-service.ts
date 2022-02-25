export interface UploadFile extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly filename: string;
  readonly path: string;
  readonly mimetype?: string;
  readonly destination: string;
  readonly webkitRelativePath: string;
}

export interface UploadService {

  list(path: string): Promise<string[]>;

  delete(path: string, file?: string): Promise<void>;

  upload(path: string, file: UploadFile[]): Promise<string[]>;

  uploadBuffer(path: string, filename:string, data: Buffer): Promise<string>;

}
