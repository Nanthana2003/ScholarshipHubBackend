const bcrypt = require("bcryptjs");
const User = require("../models/User/User.js")
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const {ExtractJwt} = require("passport-jwt");
const localStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv")
dotenv.config();

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    })
})

passport.use(
    new localStrategy({usernameField:"email"},(email,password,done)=>{
        User.findOne({email:email}).then((user)=>{
            if(!user){
                return done(null,false,{message:"User not found"})
            }
            else{
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err){
                        return done(err,false,{message:"error"})
                    };
                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message:"Incorrect password"});
                    }
                })
            }
        }).catch((err)=>{
            return done(null,false,{message:err})
        })
    })
)

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey:process.env.JWT_SECRET
        },
        async (jwtPayload,done)=>{
            try{
                const user = jwtPayload.user;
                done(null,user);
            }
            catch(error){
                done(error,false);
            }
        }
    )
)

module.exports = passport;