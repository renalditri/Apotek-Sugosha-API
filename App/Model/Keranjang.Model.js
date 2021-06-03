const sql = require("../../db");
const database = require("../../database");

class Keranjang {
  constructor(keranjang) {
    this.id_pembeli = keranjang.id_pembeli;
    this.id_produk = keranjang.id_produk;
    this.jumlah = keranjang.jumlah;
  }

  static getFromCustomer(pembeliID, result) {
    const query =
    `
      SELECT 
      krnj.id_pembeli, pmbl.nama as nama_pembeli, krnj.jumlah, prdk.nama as nama_produk, 
      prdk.harga, prdk.qty, prdk.satuan, prdk.img_path
      FROM keranjang as krnj 
      INNER JOIN pembeli as pmbl ON krnj.id_pembeli = pmbl.id_pembeli
      INNER JOIN produk as prdk ON krnj.id_produk = prdk.id_produk
      WHERE krnj.id_pembeli = ${pembeliID}
    `
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found produk: ", res);
        result(null, res);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
  }

  static create() {

  }
}

module.exports = Keranjang;