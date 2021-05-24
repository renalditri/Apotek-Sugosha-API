const Transaksi = require("../Model/Transaksi.Model");

exports.getAll = (req, res) => {
  Transaksi.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transaction."
      });
    else res.send(data);
  })
}

exports.getFromPembeli = (req, res) => {
  Transaksi.getFromPembeli(req.params.pembeliID, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transaction."
      });
    else res.send(data);
  });
}

exports.getOne = (req, res) => {
  Transaksi.getOne(req.params.nomorTR, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transaction with id ${req.params.nomorTR}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving transaction with id " + req.params.nomorTR
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

  Transaksi.update(
    req.params.nomorTR,
    new Produk(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found transaction with id ${req.params.nomorTR}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating transaction with id " + req.params.nomorTR
          });
        }
      } else res.send(data);
    }
  );
}