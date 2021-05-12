const KategoriProduk = require("../Model/Kategori.Produk.Model");

exports.getFromCategory = (req, res) => {
  KategoriProduk.getFromCategory(req.params.kategoriID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with category id ${req.params.kategoriID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving with category id " + req.params.kategoriID
        });
      }
    } else res.send(data);
  });
}

exports.create = (req, res) => {

}