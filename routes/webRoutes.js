var express = require("express")
Students = require("../models/students")
Receipt = require('../models/receipt')
Schools = require("../models/schools")
router = express.Router()


// Show all users
router.get("/home", function (req, res) {
    Schools.findById(req.user._id).populate("students").exec((err, userFound) => {
        if (err) console.log(err)
        res.render("./users/home", {
            users: userFound.students
        })
    }) // 
})

// show about page
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

// route for search
router.get("/:id/search", function (req, res) {
    searchName = req.query.searchedName
    searchDate = req.query.searchedDate
    if (searchName) {
        Students.find({
            name: {
                $regex: new RegExp(searchName, "i")
            }
        }, function (err, foundUsers) {
            if (err) {
                console.log(err)
                res.redirect("/schools/" + req.user._id + "/students/home/")
            } else if (foundUsers.length == 0) {
                req.flash('error', 'No user found')
                res.redirect("/schools/" + req.user._id + "/students/home/")
            } else if (foundUsers) {
                res.render("./users/home", {
                    users: foundUsers
                })
            }
        })
    } else if (searchDate) {
        Students.findById(req.params.id).populate('receipt').exec((err, userFound) => {
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
        res.redirect("/schools/" + req.user._id + "/students/home/")
    }


})

// Creating new user a user
router.post("/", function (req, res) {

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

    Schools.findById(req.user._id, function (err, school) {
        Students.create(newUser, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                school.students.push(user)
                school.save()
                Receipt.create(newReceipt, function (err, addBalance) {
                    if (err) {
                        console.log(err);
                    } else {
                        user.receipt.push(addBalance)
                        user.save()
                        req.flash('success', 'Successfully created a user')
                        res.redirect("/schools/" + req.user._id + "/students/home/")
                    }
                })
            }
        })
    })
})

// render the reciept page for the student
router.get("/:id", function (req, res) {
    Students.findById(req.params.id)
        .populate("receipt").exec(function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.render("./users/show", {
                    user: user
                })
                console.log('break')
                console.log(user)
            }

        })
})

// edit student modal
router.get("/:id/edit", function (req, res) {
    Students.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            res.render("./users/edit", {
                user: foundUser
            })
        }
    })
})

// Delete a student modal
router.get("/:id/delete", function (req, res) {
    Students.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            res.render("./users/delete", {
                user: foundUser
            })
        }
    })
})

// action to delete
router.delete("/:id", function (req, res) {
    Students.findByIdAndDelete(req.params.id, function (err, foundUser) {
        if (err) throw err
        Receipt.deleteMany({
            _id: {
                $in: foundUser.receipt
            }
        }, (err, deletedUser) => {
            if (err) throw err
            res.redirect("/schools/" + req.user._id + "/students/home/")
        })
    })
})


// update user
router.put("/:id", function (req, res) {
    Students.findByIdAndUpdate(req.params.id, req.body.updatedUser, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/schools/" + req.user._id + "/students/home/")
        }
    })
})

// create students reciept
router.post("/receipt/:id", function (req, res) {
    Students.findById(req.params.id, function (err, user) {
        console.log('user')
        if (err) {
            console.log(err);
            res.redirect("/schools/" + req.user._id + "/students/home/")
        } else {
            Receipt.create(req.body.receipt, function (err, newReceipt) {
                if (err) {
                    console.log(err);
                    res.redirect("/schools/" + req.user._id + "/students/home/")
                } else {
                    user.finalBalance = req.body.receipt.balance
                    user.receipt.push(newReceipt)
                    user.save()
                    res.redirect("/schools/" + req.user._id + "/students/home/")
                }
            })
        }
    })
})





module.exports = router