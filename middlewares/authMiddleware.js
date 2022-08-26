// son kullanıcı yetkisi olmayan bir sayfaya girerse giriş yap ekranına gidecek

const User = require("../models/User");

module.exports = (req, res, next) => {
  User.findById(req.session.userID, (err, user) => {
    if (err || !user) return res.redirect("/login");
    next();
  });
};
