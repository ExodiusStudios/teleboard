import { Router } from "express";
import fileUpload from "express-fileupload";
import UploadAvatarController from "./avatar";

const uploadRouter = Router();

// controllers
const uploadAvatar = new UploadAvatarController();

uploadRouter.post('/avatar', fileUpload(), uploadAvatar.build());

export default uploadRouter;