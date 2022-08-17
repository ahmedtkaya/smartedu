//kategori oluşturma silme değiştirme burada yapılacak

const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  //yeni bir kategori oluşturduk ama create sayfamız olmadığı için json oluşturuyoruz

  try {
    const category = await Category.create(req.body);
    //bu bir simülasyondur ve hatayı yakalamak için try catch yazdık
    res.status(201).json({
      status: "success",
      category,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
