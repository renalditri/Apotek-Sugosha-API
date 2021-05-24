const sql = require("../../db");

class Transaksi {
  constructor(transaksi) {
    this.nomor_transaksi = transaksi.nomor_transaksi;
    this.id_pembeli = transaksi.id_pembeli;
    this.data_pengiriman = transaksi.data_pengiriman;
  }

  static getAll(result) {
    sql.query("SELECT * FROM transaksi", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      res = res.map((r) => {
        r.data_pengiriman = JSON.parse(r.data_pengiriman);
        return r;
      })
      console.log("transaksi: ", res);
      result(null, res);
    });
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
    sql.query(`SELECT * FROM transaksi WHERE nomor_transaksi = "${nomorTR}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        res[0].data_pengiriman = JSON.parse(res[0].data_pengiriman);
        console.log("found transaction: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
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