const TransaksiProduk = require("../Model/Transaksi.Produk.Model");

exports.getFromTransaksi = (req, res) => {
  TransaksiProduk.getFromTransaksi(req.params.nomorTR, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with transaction id ${req.params.nomorTR}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving with transaction id " + req.params.nomorTR
        });
      }
    } else res.send(data);
  });
}

exports.getMostBought = (req, res) => {
  TransaksiProduk.getMostBought((err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error retrieving most bought products"
      });
    } else res.send(data);
  })
}