import { FirebaseApp } from 'firebase/app'
import { FirebaseStorage, StorageReference, UploadTaskSnapshot } from 'firebase/storage'

export interface UploadProgressHandler {
  (snapshot: UploadTaskSnapshot): void
}

export interface UploadMetadata {
  contentType?: string
  cacheControl?: string
  [key: string]: any
}

export class Storage {
  storage: FirebaseStorage

  constructor(app: FirebaseApp)

  uploadImage(
    src: string | File | HTMLImageElement,
    path: string,
    height?: number,
    width?: number,
    quality?: number,
    format?: string,
    maxPixels?: number,
    contain?: boolean,
    progressHandler?: UploadProgressHandler
  ): Promise<UploadTaskSnapshot>

  loadImage(src: string | File): Promise<HTMLImageElement>

  formatImage(
    img: HTMLImageElement,
    height?: number,
    width?: number,
    maxPixels?: number,
    contain?: boolean
  ): HTMLCanvasElement

  uploadFile(
    file: File | Blob,
    path: string,
    metadata?: UploadMetadata,
    progressHandler?: UploadProgressHandler
  ): Promise<UploadTaskSnapshot>

  downloadFile(path: string): Promise<Blob>

  getDownloadURL(path: string): Promise<string>

  deleteFile(path: string): Promise<void>

  listFiles(path: string): Promise<StorageReference[]>
}
