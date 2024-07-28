import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import User from "../models/User.js"; // Assuming you have a User model
import { PASSPORT_SECRET_KEY } from "./index.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PASSPORT_SECRET_KEY, // Use an environment variable for the secret
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
