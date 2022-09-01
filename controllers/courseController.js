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
    req.flash("success", `${course.name} has been created successfully`);
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", `Something went wrong`);
    res.status(404).redirect("/courses");
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({ slug: categorySlug });
    const query = req.query.search;

    let filter = {};

    if (categorySlug) {
      filter = {
        category: category._id,
      };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      (filter.name = ""), (filter.category = null);
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-createdAt")
      .populate("user");
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
    //course içindeki user name datasını göndermek için populate ediyoruz
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );
    const categories = await Category.find();
    res.status(200).render("course", {
      course,
      page_name: "courses",
      user,
      categories,
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

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug });
    req.flash("error", `${course.name} has been removed successfully`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    course.save();

    req.flash("success", `${course.name} has been updated successfully`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
