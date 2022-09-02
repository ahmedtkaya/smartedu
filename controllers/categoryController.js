//kategori oluşturma silme değiştirme burada yapılacak

const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  //yeni bir kategori oluşturduk ama create sayfamız olmadığı için json oluşturuyoruz

  try {
    const category = await Category.create(req.body);
    //bu bir simülasyondur ve hatayı yakalamak için try catch yazdık
    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndRemove(req.params.id); //userları siler
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
