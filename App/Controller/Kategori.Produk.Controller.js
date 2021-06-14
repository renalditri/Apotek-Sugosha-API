const KategoriProduk = require("../Model/Kategori.Produk.Model");

exports.getFromProduct = (req, res) => {
  KategoriProduk.getFromProduct(req.params.productID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with category id ${req.params.productID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving with category id " + req.params.productID
        });
      }
    } else res.send(data);
  });
}

exports.create = (req, res) => {

}