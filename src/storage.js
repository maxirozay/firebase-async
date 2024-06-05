import {
  getStorage,
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

  async uploadImage (src, path, height, width, quality = 0.8, format, maxPixels, contain, progressHandler) {
    format = format || 'webp'
    if (src.type || typeof src === 'string') {
      src = await this.loadImage(src)
    }
    const canvas = this.formatImage(src, height, width, maxPixels, contain)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/' + format, quality))
    const metadata = {
      contentType: 'image/' + format,
      cacheControl: 'public,max-age=31536000'
    }
    return this.uploadFile(blob, path + '.' + format, metadata, progressHandler)
  }

  loadImage(src) {
    return new Promise(resolve => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.crossOrigin = 'anonymous'
      image.src = src.type ? URL.createObjectURL(src) : src
    })
  }

  formatImage (image, height, width, maxPixels, contain) {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    if (!height && !width && !maxPixels) {
      ctx.drawImage(image, 0, 0)
      return canvas
    }
    const dimensions = this.getDimensions(image, height, width, maxPixels, contain)
    canvas.height = dimensions.height
    canvas.width = dimensions.width
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      (canvas.width - dimensions.scaledWidth) / 2,
      (canvas.height - dimensions.scaledHeight) / 2,
      dimensions.scaledWidth,
      dimensions.scaledHeight
    )
    return canvas
  }

  getDimensions (image, height, width, maxPixels, contain) {
    let scale
    if (maxPixels) {
      const pixels = image.width * image.height
      if (pixels > maxPixels) scale = Math.min(1, Math.sqrt(maxPixels / pixels))
    }
    const scaleW = width ? width / image.width : scale
    const scaleH = height ? height / image.height : scale
    if (width && height) {
      scale = contain ? Math.min(scaleH, scaleW) : Math.max(scaleH, scaleW)
    } else if (width) {
      scale = scaleW
    } else if (height) {
      scale = scaleH
    }
    return {
      height: height || image.height * scaleW,
      width: width || image.width * scaleH,
      scaledWidth: image.width * scale,
      scaledHeight: image.height * scale
    }
  }

  async uploadFile (file, path, meta, progressHandler) {
    return new Promise((resolve, reject) => {
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
        error => reject(error),
        async () => resolve(await getDownloadURL(storageRef))
      )
    })
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
