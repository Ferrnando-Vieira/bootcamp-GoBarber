module.exports = (req, res, next) => {
  if (req.session && !req.session.users) {
    return next()
  }

  return res.redirect('/app/dashboard')
}
