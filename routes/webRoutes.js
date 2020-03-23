var express = require("express"),
    Receipt = require('../models/receipt')
Concession = require("../models/concession")
router = express.Router(),


    router.get("/login", function (req, res) {
        res.render("login")
    })

router.get("/aboutPage", function (req, res) {
    res.render("aboutPage")
})

router.get("/new", function (req, res) {
    res.render("./users/new")
})

router.get("/about", function (req, res) {
    res.render("about")
})


// TODO: flash no user if no user is found
router.get("/:id/search", function (req, res) {
    searchName = req.query.searchedName
    searchDate = req.query.searchedDate
    if (searchName) {Concession.find({name: {$regex: new RegExp(searchName, "i")}}, function (err, foundUsers) {
            if (err) {
                console.log("Could not found User");
                res.redirect("/home")
            } else {
                res.render("./users/home", {
                    users: foundUsers
                })
            }
        })
    } else {
        Concession.findById(req.params.id).populate('receipt').exec((err, userFound) => {
            if (err) {throw err}
            userFound.receipt.searchedDate= []
            for(data of userFound.receipt){
                search = new RegExp(searchDate,'i')
                if(search.test(data.date)){
                    userFound.receipt.searchedDate.push(data)
                }
            }
            userFound.receipt.flag = true
            userFound.save()
            res.render("./users/show", {user: userFound})
        })
    }


})


// TODO: A route to delete user

router.get("/home", function (req, res) {
    Concession.find({}, function (err, allUsers) {
        if (err) {
            console.log(err);
        } else {
            res.render("./users/home", {
                users: allUsers
            })
        }
    })
})

router.post("/concession", function (req, res) {
    // Creating new user a user
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
                    res.redirect('/home')
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