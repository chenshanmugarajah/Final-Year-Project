//Consts
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

//Initialising passport module to store data in session
function initializePassport(passport, getUserByUsername) {
    const authenticateUser = async (username, password, done) => {
        //Get user from dynamodb
        const user = (await getUserByUsername(username)).Items[0]

        //Error handling
        if(typeof user == "undefined") {
            return done(null, false, { message: 'No user with that username' })
        }

        //Password check
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

    //Set passport strategy
    passport.use(new LocalStrategy({ usernameField: 'username', password: 'password'}, authenticateUser))
    
    //Log on and log off handling
    passport.serializeUser((user, done) => done(null, user.username))
    passport.deserializeUser((username, done) => {
        return done(null, getUserByUsername(username))
    })
}

//Exporting the function
module.exports = initializePassport