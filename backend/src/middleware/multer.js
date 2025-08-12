import multer from "multer";

const diskStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/temp")
    },

    filename: function(req, file , cb){
        cb(null, file.originalname)
    }
})

const memoryStorage = multer.memoryStorage();

export const upload = multer({
    storage: diskStorage,
})

export const uploadMemory = multer({
    storage: memoryStorage,
})