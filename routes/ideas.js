// Routes begind with '/ideas'

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();    // Using 'app' var from app.js
const { ensureAuthenticated } = require('../helpers/auth'); // We can import multiple functions from the helper file

/** Load Idea model */
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea page
router.get('/', ensureAuthenticated, (req, res) => {     // Equivalent to '/ideas'
    // Get ideas from DB and render on page (using handlebars)
    Idea.find({user: req.user.id})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// Add Idea form route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// Edit Idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {  // ':id' is a parameter
    Idea.findOne({
        _id: req.params.id,
        user: req.user.id
    })
        .then(idea => {
            if(idea){
                res.render('ideas/edit', {
                    idea: idea
                });
            } else {    // Go back to ideas if idea ID under different user
                Idea.find({user: req.user.id})
                .sort({ date: 'desc' })
                .then(ideas => {
                    res.render('ideas/index', {
                        ideas: ideas
                    });
                });
            }
        })
        .catch(err => { // If invalid ID added in URL
            Idea.find({user: req.user.id})
            .sort({ date: 'desc' })
            .then(ideas => {
                res.render('ideas/index', {
                    ideas: ideas
                });
            });
        });
});

router.post('/', ensureAuthenticated, (req, res) => {  // Processing forms
    // Form error handling
    let errors = [];
    if (!req.body.title) // body-parser allows us to access these attrs from the form
        errors.push({ text: 'Please add a title' });
    if (!req.body.details)
        errors.push({ text: 'Please add details' });

    if (errors.length > 0) {  // Re-render page if any errors
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {    // Successful submit
        const newUser = {   // Using object to make it scalable with users
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save() // Add idea to DB
            .then(idea => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas'); // Redirect to new page after recieving idea (promise success) from db
            });
    }
});

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    // Forms cannot send PUT request by default, but using method-override we allow it to call this endpoint
    // Find idea in DB > modify it > Save it > redirect user
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(updatedIdea => {
                    req.flash('success_msg', 'Video idea updated');
                    res.redirect('/ideas');
                })
        });
});

// Deleting idea route
router.delete('/:id', ensureAuthenticated, (req, res) => {
    // Forms cannot send DELETE request by default, but using method-override we allow it to call this endpoint
    // Find idea in DB > Delete it > redirect user
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        });
});

module.exports = router;    // Exporting so other modules could use this
