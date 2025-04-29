const { Router } = require("express");
const member = require("../controllers/memberController.js");
const memberRouter = Router();
const passport = require("passport");
const db = require("../db/queries");

memberRouter.get('/', async (req,res) => {
    const messages = await db.getMessages();
    console.log(req.user);
    res.render("index", {user: req.user, messages: messages});
});

memberRouter.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
});

memberRouter.get('/sign-up', member.createUserGet);

memberRouter.post('/sign-up',member.createUserPost);

memberRouter.get('/log-in', member.renderLoginPage);

memberRouter.post('/log-in', passport.authenticate(("local"), {
    successRedirect: '/',
    failureRedirect: '/log-in'
})
);

memberRouter.get('/member',member.renderMemberPage);

memberRouter.post('/member',member.confirmMember);

memberRouter.get('/new-message',member.renderMessagePage);

memberRouter.post('/new-message',member.submitMessagePage);

memberRouter.get('/log-out', (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect('/');
    });
});


module.exports = memberRouter;