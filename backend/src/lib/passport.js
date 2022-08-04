//Based on: https://github.com/zachgoll/express-jwt-authentication-starter/blob/final/config/passport.js

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const Farmer = require('mongoose').model('farmers');
const Admin = require('mongoose').model('admins');
const Customer = require('mongoose').model('customers');

const pathToKey = path.join(__dirname, '../..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  passReqToCallback: true,
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, function(req, jwt_payload, done) {
        let repo;
        switch (jwt_payload.role) {
            case "admin": repo = Admin; break;
            case "farmer": repo = Farmer; break;
            case "customer": repo = Customer; break;
        }

        // We will assign the `sub` property on the JWT to the database ID of user
        repo.findOne({_id: jwt_payload.sub}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                user.role = jwt_payload.role;
                return done(null, user);
            } else {
                return done(null, false);
            }
            
        });
        
    }));
}
