const sql = require("../../db");

class Produk {
  constructor(produk) {
    this.id_produk = produk.id_produk;
    this.nama = produk.nama;
    this.harga = produk.harga;
    this.qty = produk.qty;
    this.satuan = produk.satuan;
    this.deskripsi = produk.deskripsi;
    this.img_path = produk.img_path;
  }

  static getAll(result) {
    sql.query("SELECT * FROM produk", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("produk: ", res);
      result(null, res);
    });
  }

  static getOne(produkID, result) {
    sql.query(`SELECT * FROM produk WHERE id_produk = ${produkID}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        res[0].deskripsi = JSON.parse(res[0].deskripsi);
        console.log("found produk: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
  }

  static update(produkID, produk, result) {
    sql.query(
      "UPDATE produk SET nama = ?, harga = ?, qty = ?, satuan = ?, deskripsi = ? WHERE id_produk = ?",
      [produk.nama, produk.harga, produk.qty, produk.satuan, produk.deskripsi, produkID],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found product with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated product: ", { id: id, ...produk });
        result(null, { id: id, ...produk });
      }
    );
  }
}

module.exports = Produk;