import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";
// import { refreshAccessToken } from "../controllers/user.controllers.js";

const router = Router()

router.route("/register").post(
   upload.fields([
     {
      name: "profilePic",
      maxCount: 1
     }
   ]),
   registerUser
)

export default router