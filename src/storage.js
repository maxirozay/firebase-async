import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  getBlob,
  deleteObject,
  listAll,
  uploadBytesResumable
} from 'firebase/storage'

export class Storage {
  constructor (app) {
    this.storage = getStorage(app)
  }

  async uploadImage (src, path, height = 720, width, quality = 0.8, format = 'webp') {
    if (src.type) {
      src = await new Promise((resolve) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.src = URL.createObjectURL(src)
      })
    }
    const data = this.formatImage(src, height, width)
      .toDataURL('image/' + format, quality)
    const pathRef = ref(this.storage, path + '.' + format)
    const metadata = {
      contentType: 'image/' + format,
      cacheControl: 'public,max-age=31536000'
    }
    await uploadString(pathRef, data, 'data_url', metadata)
    return getDownloadURL(pathRef)
  }

  formatImage (image, height, width = 0) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const scaleW = width / image.width
    const scaleH = height / image.height
    canvas.height = height
    canvas.width = width || image.width * scaleH
    const scale = Math.max(scaleH, scaleW)
    const scaledWidth = image.width * scale
    const scaledHeight = image.height * scale
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      (canvas.width - scaledWidth) / 2,
      (canvas.height - scaledHeight) / 2,
      scaledWidth,
      scaledHeight
    )
    return canvas
  }

  async uploadFile (file, path, uploadSuccessHandler, progressHandler, meta) {
    const storageRef = ref(this.storage, path)
    const metadata = meta || {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000'
    }
    const uploadTask = uploadBytesResumable(storageRef, file, metadata)
    uploadTask.on('state_changed',
      snapshot => {
        if (progressHandler) {
          progressHandler(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%')
        }
      },
      null,
      async () => {
        if (uploadSuccessHandler) {
          uploadSuccessHandler(await getDownloadURL(storageRef))
        }
      }
    )
  }

  async download (path, name) {
    const blob = await getBlob(ref(this.storage, path))
    const link = document.createElement('a')
    link.download = name
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async deleteFile (path) {
    const storageRef = ref(this.storage, path)
    await deleteObject(storageRef)
  }

  async deleteFolder (path) {
    const res = await listAll(ref(this.storage, path))
    for (const prefix of res.prefixes) {
      await this.deleteFolder(prefix.fullPath)
    }
    for (const item of res.items) {
      await deleteObject(item)
    }
  }
}
