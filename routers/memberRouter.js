const { Router } = require("express");
const member = require("../controllers/memberController.js");
const memberRouter = Router();
const passport = require("passport");

memberRouter.get('/', (req,res) => {
    res.render("index", {user: req.user});
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



module.exports = memberRouter;