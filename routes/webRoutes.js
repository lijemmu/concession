var express = require("express")
Concession = require("../models/concession")
Receipt = require('../models/receipt')
Accounts = require("../models/accounts")
router = express.Router()


// Show all users
router.get("/home", function (req, res) {
    Accounts.findById(req.user._id).populate("concession").exec((err,userFound)=>{
        if(err) console.log(err)
        res.render("./users/home", {users: userFound.concession})
    })
})


router.get("/aboutPage", function (req, res) {
    res.render("aboutPage")
})

// Show modal to add a user
router.get("/new", function (req, res) {
    res.render("./users/new")
})

router.get("/about", function (req, res) {
    res.render("about")
})

router.get("/:id/search", function (req, res) {
    searchName = req.query.searchedName
    searchDate = req.query.searchedDate
    if (searchName) {
        Concession.find({
            name: {
                $regex: new RegExp(searchName, "i")
            }
        }, function (err, foundUsers) {
            if (err) {
                console.log(err)
                res.redirect("/home")
            } else if (foundUsers.length == 0) {
                req.flash('error', 'No user found')
                res.redirect('/home')
            } else if (foundUsers) {
                // console.log("I am here")
                // console.log(foundUsers)
                res.render("./users/home", {
                    users: foundUsers
                })
            }
        })
    } else if (searchDate) {
        Concession.findById(req.params.id).populate('receipt').exec((err, userFound) => {
            if (err) {
                throw err
            }
            userFound.receipt.searchedDate = []
            for (data of userFound.receipt) {
                search = new RegExp(searchDate, 'i')
                if (search.test(data.date)) {
                    userFound.receipt.searchedDate.push(data)
                }
            }
            userFound.receipt.flag = true
            userFound.save()
            res.render("./users/show", {
                user: userFound
            })
        })
    } else {
        req.flash('error', 'No user found')
        res.redirect("/home")
    }


})


router.post("/", function (req, res) {
    // Creating new user a user
    console.log(req.body)
    var name = req.body.name,
        finalBalance = req.body.balance,
        picture = req.body.picture,
        createDate = new Date(),
        date = (createDate.getMonth() + 1) + '/' + createDate.getDate() + '/' + createDate.getFullYear()

    var newUser = {
        name: name,
        picture: picture,
        finalBalance: finalBalance
    }
    var newReceipt = {
        date: date,
        action: finalBalance,
        balance: finalBalance
    }

    Concession.create(newUser, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            Receipt.create(newReceipt, function (err, addBalance) {
                if (err) {
                    console.log(err);
                } else {
                    user.receipt.push(addBalance)
                    user.save()
                    req.flash('success', 'Successfully created a user')
                    res.redirect("/accounts/" + req.user._id + "/concessions/home/")
                }
            })
        }
    })
})

router.get("/:id", function (req, res) {
    Concession.findById(req.params.id)
        .populate("receipt").exec(function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.render("./users/show", {
                    user: user
                })
            }

        })
})

router.get("/:id/edit", function (req, res) {
    Concession.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            res.render("./users/edit", {
                user: foundUser
            })
        }
    })
})

router.get("/:id/delete", function (req, res) {
    Concession.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            res.render("./users/delete", {
                user: foundUser
            })
        }
    })
})


router.delete("/:id", function (req, res) {
    Concession.findByIdAndDelete(req.params.id, function (err, foundUser) {
        if (err) throw err
        Receipt.deleteMany({
            _id: {
                $in: foundUser.receipt
            }
        }, (err, deletedUser) => {
            if (err) throw err
            res.redirect("/home")
        })
    })
})



router.put("/:id", function (req, res) {
    Concession.findByIdAndUpdate(req.params.id, req.body.updatedUser, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/home")
        }
    })
})


router.post("/receipt/:id", function (req, res) {
    Concession.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/home")
        } else {
            Receipt.create(req.body.receipt, function (err, newReceipt) {
                if (err) {
                    console.log(err);
                    res.redirect("/home")
                } else {
                    user.finalBalance = req.body.receipt.balance
                    user.receipt.push(newReceipt)
                    user.save()
                    res.redirect('/home')
                }
            })
        }
    })
})





module.exports = router