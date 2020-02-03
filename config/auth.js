module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash(
      'error_msg',
      'Пожалуйста залогиньтесь для входа в личный кабинет'
    );
    res.redirect('/users/login');
  }
};
