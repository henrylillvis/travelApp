var path = require('path');
var multer = require('multer');

const user = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/user')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const place = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/place')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const story = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/story')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

module.exports = {
  user: multer({storage: user}),
  place: multer({storage: place}),
  story: multer({storage: story})
}