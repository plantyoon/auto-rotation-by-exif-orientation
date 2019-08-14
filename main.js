import '@babel/core'
import EXIF from 'exif-js'

const getOrientation = (img) => new Promise((resolve) => {
  EXIF.getData(img, function () {
    const orientation = EXIF.getTag(this, 'Orientation');
    resolve(orientation)
  });
})

const loadImg = (src) => new Promise((resolve) => {
  const img = new Image
  img.onload = () => resolve(img)
  img.src = src
})

const input = document.querySelector('input[type="file"]')
input.onchange = async ({target}) => {
  const file = target.files[0]
  const fileURL = URL.createObjectURL(file)
  const img = await loadImg(fileURL)
  console.log(img.exifdata)
  const orientation = await getOrientation(img)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if ([5, 6, 7, 8].indexOf(orientation) === -1) {
    canvas.width = img.width
    canvas.height = img.height
  } else {
    canvas.width = img.height
    canvas.height = img.width
  }
  if (orientation === 3) {
    ctx.translate(canvas.width, canvas.height)
    ctx.rotate(180 * Math.PI / 180)
  }
  if (orientation === 6) {
    ctx.translate(canvas.width, 0)
    ctx.rotate(90 * Math.PI / 180)
  }
  if (orientation === 8) {
    ctx.translate(0, canvas.height)
    ctx.rotate(-90 * Math.PI / 180)
  }
  
  if (orientation === 2) {
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
  }
  if (orientation === 4) {
    ctx.translate(0, canvas.height)
    ctx.scale(1, -1)
  }
  if (orientation === 5) {
    ctx.translate(0, canvas.height)
    ctx.rotate(-90 * Math.PI / 180)
    ctx.scale(-1, 1)
    ctx.translate(-canvas.height, 0)
  }
  if (orientation === 7) {
    ctx.translate(canvas.width, 0)
    ctx.rotate(90 * Math.PI / 180)
    ctx.scale(-1, 1)
    ctx.translate(-canvas.height, 0)
  }
  ctx.drawImage(img, 0, 0)
  const blob = await new Promise(resolve => canvas.toBlob(resolve))
  console.log(blob)
  const fd = new FormData
  fd.append('photo', blob)
  // axios.post('./api/upload/photo', fd)
}