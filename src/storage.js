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

  async uploadImage (src, path, height, width, quality = 0.8, format = 'webp', maxPixels) {
    if (src.type) {
      src = await new Promise((resolve) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.src = URL.createObjectURL(src)
      })
    }
    const data = this.formatImage(src, height, width, maxPixels)
      .toDataURL('image/' + format, quality)
    const pathRef = ref(this.storage, path + '.' + format)
    const metadata = {
      contentType: 'image/' + format,
      cacheControl: 'public,max-age=31536000'
    }
    await uploadString(pathRef, data, 'data_url', metadata)
    return getDownloadURL(pathRef)
  }

  formatImage (image, height, width, maxPixels) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!height && !width && !maxPixels) {
      canvas.height = image.height
      canvas.width = image.width
      ctx.drawImage(image, 0, 0)
      return canvas
    }
    const dimensions = this.getDimensions(image, height, width, maxPixels)
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

  getDimensions (image, height, width, maxPixels) {
    let scale
    if (maxPixels) {
      const pixels = image.width * image.height
      if (pixels > maxPixels) scale = Math.sqrt(maxPixels / pixels)
    }
    const scaleW = scale || width / image.width
    const scaleH = scale || height / image.height
    scale = Math.max(scaleH, scaleW)
    return {
      height: height || image.height * scaleW,
      width: width || image.width * scaleH,
      scaledWidth: image.width * scale,
      scaledHeight: image.height * scale
    }
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
