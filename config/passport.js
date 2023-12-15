require("dotenv").config();

const User = require("../models/user.model");
const Token = require("../models/token.model");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const passport = require("passport");
const opts = {};
const jwt = require("jsonwebtoken");

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ email: jwt_payload.email });
      if (user) {
        const refreshTokenFromDB = await Token.findOne({ userId: user._id });
        if (!refreshTokenFromDB)
          return done(null, false, { message: "Invalid token" });
        const refreshPayload = jwt.verify(
          refreshTokenFromDB.token,
          process.env.REFRESH_TOKEN_SECRET
        );
        if (refreshPayload.email !== jwt_payload.email)
          return done(null, false, { message: "Invalid token" });
        const tokenExpiration = new Date(jwt_payload.exp * 1000);
        const now = new Date();
        const timeDifference = tokenExpiration.getTime() - now.getTime();
        if (timeDifference > 0 && timeDifference < 30 * 60 * 1000) {
          const payloadNew = {
            _id: user._id,
            email: user.email,
          };
          const newToken = jwt.sign(payloadNew, process.env.JWT_SECRET, {
            expiresIn: "6h",
          });
          return done(null, { user, newToken });
        }
        return done(null, { user });
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
