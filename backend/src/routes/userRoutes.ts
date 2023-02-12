import express from "express";
import {getAllUsers, getUser, editUserProfile, signup, login, logout, followUser, unfollowUser, getAllFollows, getFollows} from "../controllers/userController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

router.route("/login").post(login)
router.route("/signup").post(signup)

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllUsers);
router.get("/getallfollows", getAllFollows)
router.get("/follows", getFollows)

router.route("/editprofile").patch(editUserProfile)
router.route("/logout").post(logout)

router.get("/:id", getUser);
router.post("/:id/follow", followUser);
router.post("/:id/unfollow", unfollowUser);

//routes below require a user to be an admin
// router.use(validateAdmin)

export default router;