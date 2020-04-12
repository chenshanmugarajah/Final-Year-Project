const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

function initializePassport(passport, getUserByUsername) {
    
    const authenticateUser = async (username, password, done) => {
        const user = (await getUserByUsername(username)).Items[0]

        if(typeof user == "undefined") {
            return done(null, false, { message: 'No user with that username' })
        }
        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch(e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username', password: 'password'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.username))
    passport.deserializeUser((username, done) => {
        return done(null, getUserByUsername(username))
    })
}

module.exports = initializePassport