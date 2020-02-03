const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Необходимо заполнить все поля' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Пароли не совпадают' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Пароль должен содержать больше 6 символов' });
  }

  if (errors.length > 0) {
    // Validation failed
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        // User exists
        errors.push({
          msg: `Пользователь с почтой ${email} существует`
        });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        // Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // Save user in DB
            newUser
              .save()
              .then(() => {
                req.flash(
                  'success_msg',
                  'Вы зарегестрированы и теперь можете залогинеться'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Loguot Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Вы разлогинелись');
  res.redirect('/users/login');
});

module.exports = router;
