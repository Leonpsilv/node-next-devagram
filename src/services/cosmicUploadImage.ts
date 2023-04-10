import multer from 'multer';
import cosmicjs from 'cosmicjs';

const {
    KEY_WRITE_AVATARS,
    KEY_WRITE_POSTS,
    BUCKET_AVATARS,
    BUCKET_POSTS
} = process.env

const Cosmic = cosmicjs()
const avatarsBucket = Cosmic.bucket({
    slug: BUCKET_AVATARS,
    write_key: KEY_WRITE_AVATARS
})

const postsBucket = Cosmic.bucket({
    slug: BUCKET_POSTS,
    write_key: KEY_WRITE_POSTS
})

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const cosmicUploadImage = async (req: any) => {
    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        }

        if(req.url && req.url.includes('post')){
            return await postsBucket.addMedia({ media: media_object }) 
        }
        else {
            return await avatarsBucket.addMedia({ media: media_object }) 
        }
    }
}

export {upload, cosmicUploadImage}