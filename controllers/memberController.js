const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const pool = require("../db/pool");

const passwordMessage = 'Please enter a password with at least 5 characters.'

const validateUser = [
    body("firstname").isAlpha().withMessage('First name must contain letters only.'),
    body("lastname").isAlpha().withMessage('Last name must contain letters only.'),
    body("username").trim().notEmpty().withMessage('Please enter a username.'),
    body("password").trim().notEmpty().withMessage('Please enter a password.').isLength({min: 5}).withMessage(`${passwordMessage}`),
    body("confirmpassword").custom((value, {req}) => {
        return value === req.body.password;
    }).withMessage('Please enter the same password in the password field and the confirm password field.'),
];

const validateMember = [
    body("memberpassword").custom((value) =>{
        return value === "cringubest";
    }).withMessage('Incorrect code! Try again!'),
];

const validateMessage = [
    body("message").notEmpty().withMessage('Must contain content.'),
];

exports.createUserGet = (req,res) => {
    res.render("sign-up-form", {});
}

exports.createUserPost = [
    validateUser,
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            //create user query + hash
            return res.status(400).render("sign-up-form", {
                title: "Sign up!",
                errors: errors.array(),
            });
        }
        const data = req.body;
        console.log(data);
        const hashedPass = await bcrypt.hash(data.password,10);
        console.log(hashedPass);
        await db.addUser(data.firstname,data.lastname,data.username,hashedPass);
        res.redirect('/');
    }
];

exports.renderMemberPage = (req,res) => {
    res.render("member-join", {});
}

exports.confirmMember = [
    validateMember,
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render("member-join", {
                title: "Member",
                errors: errors.array(),
            });
        }
        console.log(req.user);
        await db.updateMemberStatus(req.user.username); //replace req.body.username with username stored in passport
        res.redirect('/');
    }
];

exports.renderLoginPage = (req,res) => {
    res.render("log-in-form", {});
}

exports.renderMessagePage = (req,res) => {
    res.render("new-message-form", {user: req.user});
}

exports.submitMessagePage = [
    validateMessage,
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render("new-message", {
                title: "Member",
                errors: errors.array(),
            });
        }
        const date = new Date();
        console.log(date);
        console.log(req.body.message);
        console.log(req.user.username);
        await db.addMessage(date,req.body.message,req.user.username);
        res.redirect('/');
    }
];

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
      const user = rows[0];
      done(null, user);
    } catch(err) {
      done(err);
    }
  });
