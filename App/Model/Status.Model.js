const sql = require("../../db");

class Status {
  constructor(status) {
    this.nomor_transaksi = status.nomor_transaksi;
    this.id_resep = status.id_resep;
    this.status = status.status;
    this.jenis = status.jenis;
  }

  static getAll(result) {
    sql.query(`
      SELECT
      tr.id_pembeli, st.status, st.jenis, st.nomor_transaksi, tr.data_pengiriman, rs.id_resep, rs.img_path, st.last_updated
      FROM status AS st
      INNER JOIN transaksi AS tr ON st.nomor_transaksi = tr.nomor_transaksi
      LEFT JOIN resep AS rs ON st.id_resep = rs.id_resep
    `, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      res.map(r => {
        r.data_pengiriman = JSON.parse(r.data_pengiriman)
      })
      console.log("status: ", res);
      result(null, res);
    });
  }

  static getByStatus(statusID, result) {
    sql.query(`
      SELECT
      tr.id_pembeli, st.status, st.jenis, st.nomor_transaksi, tr.data_pengiriman, rs.id_resep, rs.img_path, st.last_updated
      FROM status AS st
      INNER JOIN transaksi AS tr ON st.nomor_transaksi = tr.nomor_transaksi
      LEFT JOIN resep AS rs ON st.id_resep = rs.id_resep
      WHERE st.status = "${statusID}"
    `, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      res.map(r => {
        r.data_pengiriman = JSON.parse(r.data_pengiriman)
      })
      console.log("status: ", res);
      result(null, res);
    });
  }

  static getFromTransaksi(nomorTR, result) {
    sql.query(`
      SELECT
      tr.id_pembeli, st.status, st.jenis, st.nomor_transaksi, tr.data_pengiriman, rs.id_resep, rs.img_path, st.last_updated
      FROM status AS st
      INNER JOIN transaksi AS tr ON st.nomor_transaksi = tr.nomor_transaksi
      LEFT JOIN resep AS rs ON st.id_resep = rs.id_resep
      WHERE st.nomor_transaksi = "${nomorTR}"
    `, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return
      }
      res[0].data_pengiriman = JSON.parse(res[0].data_pengiriman);
      console.log("status: ", res);
      result(null, res);
    })
  }

  static create(status, result) {
    sql.query('INSERT INTO status SET ?, last_updated = now()', status, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log('created status: ', { id: res.insertId, ...status });
      result(null, { id: res.insertId, ...status });
      return;
    })
  }

  static updateByResep(resepID, result) {
    sql.query('UPDATE status SET status = 1 WHERE id_resep = ?', resepID, (err, res) => {
      if(err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      if (res == null) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log('updated status: ', 1);
      result(null, {id: res.affectedRows, status: 1});
      return;
    })
  }

  static update(nomorTR, status, result) {
    sql.query('UPDATE status SET status = ? WHERE nomor_transaksi = ?', [status.status, nomorTR], (err, res) => {
      if(err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      if (res == null) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log('updated status: ', status);
      result(null, {nomor_transaksi: nomorTR, status: status.status});
      return;
    })
  }
}

module.exports = Status;