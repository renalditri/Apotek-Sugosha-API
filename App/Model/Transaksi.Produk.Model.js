const sql = require("../../db");
const database = require("../../database");

class TransaksiProduk {
  constructor(transaksiProduk) {
    this.nomor_transaksi = transaksiProduk.nomor_transaksi;
    this.id_produk = transaksiProduk.id_produk;
    this.jumlah = transaksiProduk.jumlah;
  }

  static getFromTransaksi(nomorTR, result) {
    const query =
      `
      SELECT 
      pt.nomor_transaksi, tr.id_pembeli, pr.id_produk, pt.jumlah, pr.nama as nama_produk, pr.harga, pr.qty, pr.satuan, pr.img_path
      FROM produk_transaksi as pt
      INNER JOIN transaksi as tr ON pt.nomor_transaksi = tr.nomor_transaksi
      INNER JOIN produk as pr ON pt.id_produk = pr.id_produk
      WHERE pt.nomor_transaksi = "${nomorTR}"
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

  static create(produk_transaksi, result) {
    database.query(`
    SELECT * FROM produk_transaksi WHERE nomor_transaksi = ? AND id_produk = ?
    `, [produk_transaksi.nomor_transaksi, produk_transaksi.id_produk])
      .then(res => {
        if (!res.length) {
          sql.query('INSERT INTO produk_transaksi SET ?', produk_transaksi, (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
            console.log('created transaction product: ', { ...produk_transaksi });
            result(null, { ...produk_transaksi });
            return;
          })
        } else {
          result({ kind: "exists" }, null);
          return;
        }
      })
  }
}

module.exports = TransaksiProduk;