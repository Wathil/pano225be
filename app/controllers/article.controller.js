const db = require("../models");
const ArticleDB = db.articles;

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

// Create and Save a new Article
exports.create = (req, res) => {
  // Validate request
  if (!req.body.a) {
    res.status(400).send({ message: "a Content can not be empty!" });
    return;
  }
  if (!req.body.d) {
    res.status(400).send({ message: "d Content can not be empty!" });
    return;
  }
  if (!req.body.m) {
    res.status(400).send({ message: "m Content can not be empty!" });
    return;
  }
  let i = (+req.body.d - 1) + ((+req.body.m - 1) * 32) + ((req.body.a - 2020) * 512);

  // Create a Article
  const article = new ArticleDB({
    artiste: req.body.artiste,
    musique: req.body.musique,
    zone: req.body.zone,
    lieu: req.body.lieu,
    tel: req.body.tel,
    tel2: req.body.tel,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
    whatsapp: req.body.whatsapp,
    facebook: req.body.facebook,
    d: req.body.d,
    m: req.body.m,
    a: req.body.a,
    i: i, //
    url: req.body.url,
    annule: req.body.annule ? req.body.annule : false,
  });

  // Save Article in the database
  article
    .save(article)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Article.",
      });
    });
};

// Retrieve all Articles from the database.
exports.findAll = (req, res) => {
  const { page, size, artiste } = req.query;

  console.log("findall page="+page+" size="+size);

  let d = new Date();
  let qd = (d.getDate() - 1) + (d.getMonth() * 32) + ((d.getFullYear() - 2020) * 512);

  let condition = {
    i: { $gte: qd}
  };

  const { limit, offset } = getPagination(page, size);
  const options = {
    select: 'artiste musique zone lieu tel tel2 twitter instagram whatsapp facebook d m a url annule',
    sort: { i: 1 },
    limit,
    offset
  }

  ArticleDB.paginate(condition, options)
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        articles: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving articles.",
      });
    });
};

// Find a single Article with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ArticleDB.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Article with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Article with id=" + id });
    });
};

// Update a Article by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  ArticleDB.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Article with id=${id}. Maybe Article was not found!`,
        });
      } else res.send({ message: "Article was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Article with id=" + id,
      });
    });
};

// Delete a Article with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ArticleDB.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Article with id=${id}. Maybe Article was not found!`,
        });
      } else {
        res.send({
          message: "Article was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Article with id=" + id,
      });
    });
};

// Delete all Articles from the database.
exports.deleteAll = (req, res) => {
  ArticleDB.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Articles were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all articles.",
      });
    });
};

// Find all published Articles
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  ArticleDB.paginate({ annule: true }, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        articles: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving articles.",
      });
    });
};
