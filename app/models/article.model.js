module.exports = (mongoose, mongoosePaginate) => {
  var articleSchema = mongoose.Schema(
    {
      artiste: { type: String, required: true },
      musique: { type: String, required: true },
      zone: { type: String, required: true },
      lieu: { type: String, required: true },
      tel: { type: String, required: false },
      tel2: { type: String, required: false },
      twitter: { type: String, required: false },
      instagram: { type: String, required: false },
      whatsapp: { type: String, required: false },
      facebook: { type: String, required: false },
      a: { type: Number, required: true },
      m: { type: Number, required: true },
      d: { type: Number, required: true },
      i: { type: Number, required: true },
      url: { type: String, required: true },
      annule: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
  );

  articleSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    //object.id = _id;
    return object;
  });

  articleSchema.plugin(mongoosePaginate);

  //   const Article = mongoose.model("tutorial", article);
  const Article = mongoose.model("article", articleSchema); // nouvelle table créée
  return Article;
};
