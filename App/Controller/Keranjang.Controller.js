const Keranjang = require("../Model/Keranjang.Model");

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

}