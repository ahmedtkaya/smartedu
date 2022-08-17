const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true, //bu isimden sadece bir veri istiyorsak yazacağız
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});
//bununla url kısmında beraber id yerine name gözükecek
CategorySchema.pre("validate", function (next) {
  this.slug = slugify(this.name, {
    // burada slug ile name'i eşitliyor
    lower: true,
    strict: true, //name'de gereksiz karakterleri siler (- :) gibi
  });
  next();
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
