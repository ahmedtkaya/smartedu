const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  //yeni bir kurs oluşturduk ama create sayfamız olmadığı için json oluşturuyoruz

  try {
    const course = await Course.create(req.body);
    //bu bir simülasyondur ve hatayı yakalamak için try catch yazdık
    res.status(201).json({
      status: "success",
      course,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).render("courses", {
      courses,
      page_name: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
