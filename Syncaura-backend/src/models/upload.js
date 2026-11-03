import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination:"uploads/chat",
    filename:(req,file,cb) =>{
        cb(null,Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({storage});
export default upload;