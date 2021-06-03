const Produk = require("../Model/Produk.Model");

exports.getAll = (req, res) => {
  Produk.getAll(req.query, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
}

exports.getOne = (req, res) => {
  Produk.getOne(req.params.productID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found product with id ${req.params.productID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving product with id " + req.params.productID
        });
      }
    } else res.send(data);
  });
}

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Produk.update(
    req.params.customerId,
    new Produk(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found product with id ${req.params.productID}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating product with id " + req.params.productID
          });
        }
      } else res.send(data);
    }
  );
}