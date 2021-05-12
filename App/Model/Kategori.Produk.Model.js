const sql = require("../../db");

class KategoriProduk {
  constructor(kategoriProduk) {
    this.id_produk = kategoriProduk.id_produk;
    this.id_kategori = kategoriProduk.id_kategori;
  }

  static getFromCategory(kategoriID, result) {
    const query =
    `
      SELECT 
      kt.id_kategori, kt.nama as nama_kategori, pr.id_produk, pr.nama as nama_produk, pr.harga, pr.qty, pr.satuan, pr.img_path
      FROM kategori_produk as kp
      INNER JOIN kategori as kt ON kp.id_kategori = kt.id_kategori
      INNER JOIN produk as pr ON kp.id_produk = pr.id_produk
      WHERE kp.id_kategori = ${kategoriID}
    `
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found: ", res);
        result(null, res);
        return;
      }

      result({ kind: "not_found" }, null);
    });
  }

  static create() {

  }
}

module.exports = KategoriProduk;