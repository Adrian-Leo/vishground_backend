import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import passport from "passport";
import db from "../db/db.js";
import logger from "../tools/logging.js";

const { Strategy: GoogleStrategy } = Strategy;

dotenv.config({
  path: "local.env",
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_BASE_URL + "auth/google/callback",
      scope: ["profile", "email"],
    },
    async (_, __, ____, profile, done) => {
      const account = profile._json;
    //   let user = {};
      try {
        logger.info(account.email)
    //     user = await db.query("SELECT * FROM users WHERE google_id = $1", [
    //       account.email,
    //     ]);
    //     if (user.rows.length > 0) {
    //       console.log("User already registered, continuing to login");
    //     } else {
    //       user = await pool.query(
    //         "INSERT INTO users (username, email, img, wid) VALUES ($1, $2, $3, $4) RETURNING *",
    //         [account.name, account.email, account.picture, walletId]
    //       );
    //       console.log("User successfully registered in database");
    //     }
        done(null, account.id);
      } catch (err) {
        console.log(err);
        done(err);
      }
    }
  )
);

passport.serializeUser((id, done) => {
  done(null, id);
});

passport.deserializeUser((id, done) => {
  pool.query("SELECT * FROM users WHERE google_id = $1", [id], (err, results) => {
    if (err) {
      return done(err);
    }
    return done(null, results.rows[0]);
  });
});

export default passport;