import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // file-> we get all the files, cd-> call back
      cb(null, './public/temp')
    // 2nd one is file destination :
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
 export const upload = multer({ storage: storage })