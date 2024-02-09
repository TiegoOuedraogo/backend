const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/UserModel');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
    passport.use(
        new Strategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                console.error(error);
            }
        })
    );
};
