module.exports = (req, res, next) => {

  if (!req.session.isLoggedIn) {
    console.log('NOT LOGGED IN');
    res.redirect('/login');
  } else {
    next();
  }
};
