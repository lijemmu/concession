var express = require('express'),
    passport = require('passport'),
    Schools = require('../models/schools'),
    Students = require("../models/students"),
    Receipt = require('../models/receipt'),
    async = require("async"),
        nodemailer = require("nodemailer"),
        crypto = require("crypto"),
        router = express.Router();


// Login Route
router.get("/", function (req, res) {
    res.render("login")
})


router.get("/about", function (req, res) {
    res.render("about")
})

// Add a user to the db
router.post("/register", function (req, res) {
    if (req.body.password === req.body.confpassword) {
        Schools.register(new Schools({
            username: req.body.username,
            email: req.body.email,
            info: {
                supervisorName: req.body.supervisorName,
                supervisorPhone: req.body.supervisorPhone,
                schoolAdress: req.body.schoolAdress,
                schoolAdress2: req.body.schoolAdress2,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode,
            }
        }), req.body.password, function (err, schools) {
            if (err) {
                req.flash("error", err.message)
                res.redirect("/")
            }
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to Concessions ")
                res.redirect("/schools/" + req.user._id + "/students/home/")
            })
        })
    } else {
        req.flash("error", " Please make sure your passwords match")
        res.redirect("/")
    }
})



// Update School Information
router.put("/:id", function (req, res) {
    Schools.findOne(req.params.user_id, (err, editedUser) => {
        if (err) {
            throw err
        }
        editedUser.email = req.body.email
        editedUser.info.supervisorName = req.body.supervisorName
        editedUser.info.supervisorPhone = req.body.supervisorPhone
        editedUser.save()
        res.redirect("/schools/" + req.user._id + "/students/home/")

    })
})

// Delete Account 
router.delete("/:id/delete", function (req, res){
    if (req.user.username === req.body.delete){
        Schools.findOneAndDelete(req.params.id, function(err, foundUser) {
            if (err) throw err
            Students.deleteMany({
                _id: {
                    $in:  foundUser.students
                }
            }, (err) => {
                if (err) throw err
                req.flash("success", "Your Account has been Deleted")
                res.redirect("/")
            })
        })
    } else {
        req.flash("error", "Make sure you type you follow the instruction")
        res.redirect('back')
    }
})

// Authenticate the user from db / Login
router.post('/login', passport.authenticate('local', {
    failureRedirect: "/",
    failureFlash: "Wrong School Name or Password"
}), (req, res) => {
    req.flash("success", "Welcome back " + req.body.username)
    res.redirect("/schools/" + req.user._id + "/students/home/")
    // /accounts/" + req.user._id + "/concessions
})




// logout 
router.get("/logout", function (req, res) {
    req.logout()
    req.flash("success", "Thank you, you are logged out")
    res.redirect("/")
})





router.post("/forgot", function (req, res, buf) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            Schools.findOne({
                email: req.body.email
            }, function (err, user) {
                if (!user) {
                    req.flash("error", "No Schools with that registered email adress exist.");
                    return res.redirect("/");
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // Expires in hours

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'ftest9060@gmail.com', // TODO fill this out
                    pass: process.env.GMAILPASS // TODO fill this out
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'ftest9060@gmail.com',
                Subject: "Reset Password",
                text: ' You are receiving this because you (or someone else) have requested to reset the password of your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignor this email and your password will remail unchanged. \n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                req.flash("success", 'An e-mail has been sent to ' + user.email + ' with further instruction.');
                done(err, 'done');
                console(err)
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

router.get('/reset/:token', function (req, res) {
    Schools.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired,');
            return res.redirect('/');
        }
        res.render("reset", {
            token: req.params.token
        });
    });
});

router.post('/reset/:token/', function (req, res) {
    async.waterfall([
        function (done) {
            Schools.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function (err, user) {
                if (!user) {
                    req.flash("error", 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'ftest9060@gmail.com',
                    pass: process.env.GMAILPASS
                }
            });
            var mailOptions = {
                to: user.email,
                from: '<No Reply> Concessions@gmail.com',
                Subject: 'Your Password has been changed',
                text: 'Hello, \n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/')
    });
});







module.exports = router