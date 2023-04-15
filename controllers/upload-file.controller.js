import express from "express"
import {initializeApp} from "firebase/app"
import {getStorage, ref} from "firebase/storage"
import multer from "multer"
import config from "../config/firebase.config"


const router = express.Router();

//init firebase app
initializeApp(config.firebaseConfig);
//init cloud storage and get a ref to the servie
const storage = getStorage();
//setting up multer as a middleware to grab photo uploads
const upload = multer({storage: multer.memoryStorage()});
router.post("/", upload.single("filename"), async (req, res) => {
        try {
            const dateTime = giveCurrentDateTime();
            const storageRef = ref(storage, `files/${req.file.originalname + "    " + dateTime}`);

            //create metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };

            //upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            //by using uploadBytes.. we can controll the progress of uploading like pause resume etc.

            //grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref)
            console.log('File successfully uploaded.');
            return res.send({
                message: 'file uploaded to firebase storage',
                name: req.file.originalname,
                type: req.file.mimetype,
                downloadURL: downloadURL
            })

        } catch (error) {
            return res.status(400).send(error.message);
        }

    }
);

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = todat.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDay() + 1
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}
export default router;
