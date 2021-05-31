const sql = require("../../db");
const database = require("../../database");

class Transaksi {
  constructor(transaksi) {
    this.nomor_transaksi = transaksi.nomor_transaksi;
    this.id_pembeli = transaksi.id_pembeli;
    this.data_pengiriman = transaksi.data_pengiriman;
  }

  static getAll(result) {
    let row;
    database.query(`
      SELECT
      trn.nomor_transaksi, sts.jenis, sts.status, bkt.img_path as bukti_pembayaran, 
      trn.id_pembeli, pmb.nama, pmb.nomor_telepon, trn.data_pengiriman
      FROM transaksi as trn
      INNER JOIN pembeli as pmb ON trn.id_pembeli = pmb.id_pembeli
      INNER JOIN status as sts ON trn.nomor_transaksi = sts.nomor_transaksi
      LEFT JOIN bukti_pembayaran as bkt ON trn.nomor_transaksi = bkt.nomor_transaksi
    `)
    .then(res => {
      row = res;
      let arr = [];
      row.forEach(async (r, i) => {
        const nomorTR = r.nomor_transaksi;
        const row2 = await database.query(`
          SELECT 
          pr.id_produk, pt.jumlah, pr.nama as nama_produk, pr.harga, pr.qty, pr.satuan, pr.img_path
          FROM produk_transaksi as pt
          INNER JOIN produk as pr ON pt.id_produk = pr.id_produk
          WHERE pt.nomor_transaksi = "${nomorTR}"
        `);
        r.data_pengiriman = JSON.parse(r.data_pengiriman);
        arr.push(r);
        arr[i].produk = row2;
        if( i == (row.length - 1) ) {
          console.log("Found transactions: ");
          console.log(arr);
          result(null, arr)
        };
      })
      return arr;
    })
    return;
  }

  static getFromPembeli(pembeliID, result) {
    sql.query(`SELECT * FROM transaksi WHERE id_pembeli = ${pembeliID}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      res.map(r => {
        r.data_pengiriman = JSON.parse(r.data_pengiriman)
      })
      console.log("transaction: ", res);
      result(null, res);
    });
  }

  static getOne(nomorTR, result) {
    let row1, row2, row;
    database.query(`
      SELECT
      trn.nomor_transaksi, sts.jenis, sts.status, bkt.img_path as bukti_pembayaran, 
      trn.id_pembeli, pmb.nama, pmb.nomor_telepon, trn.data_pengiriman
      FROM transaksi as trn
      INNER JOIN pembeli as pmb ON trn.id_pembeli = pmb.id_pembeli
      INNER JOIN status as sts ON trn.nomor_transaksi = sts.nomor_transaksi
      LEFT JOIN bukti_pembayaran as bkt ON trn.nomor_transaksi = bkt.nomor_transaksi
      WHERE trn.nomor_transaksi = "${nomorTR}"
    `)
      .then(res => {
        if (res.length) {
          res[0].data_pengiriman = JSON.parse(res[0].data_pengiriman);
          row1 = res[0];
          return database.query(`
            SELECT 
            pr.id_produk, pt.jumlah, pr.nama as nama_produk, pr.harga, pr.qty, pr.satuan, pr.img_path
            FROM produk_transaksi as pt
            INNER JOIN produk as pr ON pt.id_produk = pr.id_produk
            WHERE pt.nomor_transaksi = "${nomorTR}"
          `);
        }
      })
      .then(res => {
        row2 = res;
        row = row1;
        if (row == null) {
          result({ kind: "not_found" }, null);
          return;
        }
        row.produk = row2;
        console.log("found transaction: ", row);
        result(null, row);
        return;
      })
    return;
  }

  static update(nomorTR, transaksi, result) {
    sql.query(
      "UPDATE transaksi SET data_pengiriman = ? WHERE nomor_transaksi = ?",
      [transaksi.data_pengiriman, nomorTR],
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

        console.log("updated transaction: ", { id: nomorTR, ...transaksi });
        result(null, { id: nomorTR, ...transaksi });
      }
    );
  }
}

module.exports = Transaksi;