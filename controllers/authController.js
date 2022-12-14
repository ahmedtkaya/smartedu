//kategori oluşturma silme değiştirme burada yapılacak

const User = require("../models/User");
const Category = require("../models/Category");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const Course = require("../models/Course");

exports.createUser = async (req, res) => {
  //yeni bir user oluşturduk ama create sayfamız olmadığı için json oluşturuyoruz

  try {
    const user = await User.create(req.body);
    //bu bir simülasyondur ve hatayı yakalamak için try catch yazdık
    res.status(201).redirect("/login");
  } catch (error) {
    const errors = validationResult(req);
    console.log(errors);
    console.log(errors.array()[0].msg);

    for (let i = 0; i < errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg}`);
    }
    res.status(400).redirect("/register");
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
          } else {
            req.flash("error", "Your password is not correct");
            res.status(400).redirect("/login");
          }
        });
      } else {
        req.flash("error", "User is not exist!");
        res.status(400).redirect("/login");
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
  const user = await User.findOne({ _id: req.session.userID }).populate(
    "courses"
  ); //dahboard sayfasında db den name gösterme
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  const users = await User.find(); // tüm kullanıcıları admine yolla
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
    users,
  });
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id); //userları siler
    await Course.deleteMany({ user: req.params.id }); // teacher silince onun yarattığı kursları da silmek için bunu yazıyoruz
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
