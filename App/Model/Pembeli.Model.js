const sql = require("../../db");

class Pembeli {
  constructor(pembeli) {
    this.id_pembeli = pembeli.id_pembeli
    this.nomor_telepon = pembeli.nomor_telepon;
    this.nama = pembeli.nama;
    this.tanggal_lahir = pembeli.tanggal_lahir;
  }

  static getAll(result) {
    sql.query("SELECT * FROM pembeli", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      res = res.map((r) => {
        delete r.password;
        return r;
      })
      console.log("pembeli: ", res);
      result(null, res);
    });
  }

  create() {

  }

  update() {

  }
}

module.exports = Pembeli;