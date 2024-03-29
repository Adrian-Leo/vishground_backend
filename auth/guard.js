import express from "express";
import paseto from "./paseto.js";
import logger from "../tools/logging.js";
const router = express.Router();

const { SERVER_BASE_URL } = process.env;

const authGuard = (req, res, next) => {
  // Check if the user has a valid session
  if (req.session && req.session.passport && req.session.passport.user) {
    const token = req.session.passport.user;
    paseto
      .verifyToken(token)
      .then((payload) => {
        if (payload.google_id != req.user.google_id) {
          logger.error("Invalid token");
          res.redirect(SERVER_BASE_URL + "sessionError");
        }
        logger.info("Valid token")
        next();
      })
      .catch((error) => {
        // Token verification failed, or the token has expired
        logger.error(error);
        res.redirect(SERVER_BASE_URL + "sessionError");
      });
  } else {
    logger.error("No valid session found");
    res.redirect(SERVER_BASE_URL + "sessionError");
  }
};

router.get("/sessionError", (req, res) => {
  res.status(401).json({
    success: false,
    message: "User not logged in or session expired",
  });
});

export default router;
export { authGuard };
