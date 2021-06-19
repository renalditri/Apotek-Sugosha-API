const Keranjang = require("../Model/Keranjang.Model");
const validasi = require("./Validasi");

exports.getFromCustomer = (req, res) => {
  Keranjang.getFromCustomer(req.params.pembeliID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found cart with user id ${req.params.pembeliID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving cart with user id " + req.params.pembeliID
        });
      }
    } else res.send(data);
  });
}

exports.create = (req, res) => {
  const keys = ["id_pembeli", "id_produk", "jumlah"];
  const types = ["number", "number", "number"];
  const validated = validasi.Validasi(req.body, keys, types, true);
  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }

  Keranjang.create(validated, (err, data) => {
    if (err)
      if (err.kind === "exists") {
        res.status(409).send({
          message:
            err.message || "Data with the same keys already exists, please use update instead."
        });
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Cart."
        });
      }
    else res.send(data);
  })
}

exports.update = (req, res) => {
  const keys = ["id_pembeli", "id_produk", "jumlah"];
  const types = ["number", "number", "number"];
  const validated = validasi.Validasi(req.body, keys, types, false);

  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }

  Keranjang.update(req.params.pembeliID, req.params.produkID, validated, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found cart with id_pembeli ${req.params.pembeliID} and id_produk ${req.params.produkID}.`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving cart with id ${req.params.pembeliID} and id_produk ${req.params.produkID}.`
        });
      }
    }
    else res.send(data);
  })
}

exports.delete = (req, res) => {
  Keranjang.delete(req.params.pembeliID, req.params.produkID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found cart with id_pembeli ${req.params.pembeliID} and id_produk ${req.params.produkID}.`
        });
      } else {
        res.status(500).send({
          message: `Could not delete cart with id_pembeli ${req.params.pembeliID} and id_produk ${req.params.produkID}.`
        });
      }
    } else { res.send({ message: `Cart was deleted successfully!` }) };
  });
}