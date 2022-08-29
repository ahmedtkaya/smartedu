const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  //yeni bir kurs oluşturduk ama create sayfamız olmadığı için json oluşturuyoruz

  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    //bu bir simülasyondur ve hatayı yakalamak için try catch yazdık
    res.status(201).redirect("/courses");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};

    if (categorySlug) {
      filter = {
        category: category._id,
      };
    }

    const courses = await Course.find(filter).sort("-createdAt");
    const categories = await Category.find();

    res.status(200).render("courses", {
      courses,
      categories,
      page_name: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
//tekil data sayfasını gösterme metodu
exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );

    res.status(200).render("course", {
      course,
      page_name: "courses",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID); //kullanıcımı bulduk
    await user.courses.push({ _id: req.body.course_id }); //userin courses alanına yeni bir course ekliyoruz(!)
    await user.save();

    res.status(200).redirect("/users/dashboard"); //işlemi yapan ilgili usersın dashboardına gider (users dediğim şey kullanıcının takendisi)
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID); //kullanıcımı bulduk
    await user.courses.pull({ _id: req.body.course_id }); //userin courses alanından kurs çıkarıyoruz pull ile(!)
    await user.save();

    res.status(200).redirect("/users/dashboard"); //işlemi yapan ilgili usersın dashboardına gider (users dediğim şey kullanıcının takendisi)
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
