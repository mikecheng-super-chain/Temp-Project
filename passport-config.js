//const { authenticate } = require('passport')

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
    //To check whatever the user enters match what they reg.
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, {message: 'Incorrect user-email! Please try again'})
        }

        try {
            if ( await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else {
                return done(null, false, { message: 'Incorrect Password! Please try again'})
            }
        }
        catch {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { return (done(null, getUserById(id)))})
}

module.exports = initialize