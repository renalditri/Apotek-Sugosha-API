const database = require("../../database");

class BuktiPembayaran {
  static create(bukti, result) {
    database.query(`SELECT * FROM bukti_pembayaran WHERE nomor_transaksi = ?`, bukti.nomor_transaksi)
      .then(resolved => {
        if (!resolved.length) {
          database.query('INSERT INTO bukti_pembayaran SET ?', bukti)
            .then(res => {
              console.log('created bukti: ', { id: res.insertId, ...bukti });
              result(null, { id: res.insertId, ...bukti });
              return;
            }, err => {
              console.log("error: ", err);
              result(err, null);
              return;
            })
        } else {
          result({ kind: "exists" }, null);
          return;
        }
      })
  }
}
module.exports = BuktiPembayaran;