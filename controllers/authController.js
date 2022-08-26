//kategori oluşturma silme değiştirme burada yapılacak

const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  //yeni bir user oluşturduk ama create sayfamız olmadığı için json oluşturuyoruz

  try {
    const user = await User.create(req.body);
    //bu bir simülasyondur ve hatayı yakalamak için try catch yazdık
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
exports.loginUser = async (req, res) => {
  //login user function

  try {
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
          //girdiğim password ve db'de ki passwordu karşılaştırır aynı ise girer
          if (same) {
            //user session
            req.session.userID = user._id;
            res.status(200).redirect("/users/dashboard");
          }
        });
      }
    }); //burada bodyden girilen email ile db'de ki emaili yakalar, eşitse alır
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }); //dahboard sayfasında db den name gösterme

  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
  });
};
