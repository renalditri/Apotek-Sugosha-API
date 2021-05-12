const Kategori = require("../Model/Kategori.Model");

exports.getAll = (req, res) => {
  Kategori.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    else res.send(data);
  });
}

exports.getOne = (req, res) => {
  Kategori.getOne(req.params.kategoriID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found category with user id ${req.params.kategoriID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving category with user id " + req.params.kategoriID
        });
      }
    } else res.send(data);
  });
}

exports.create = (req, res) => {

}