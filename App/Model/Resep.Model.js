const sql = require("../../db");

class Resep {
  constructor(resep) {
    this.id_resep = resep.id_resep;
    this.id_pembeli = resep.id_pembeli;
    this.img_path = resep.img_path;
  }

  static getOne(resepID, result) {
    sql.query(`SELECT * FROM resep WHERE id_resep = "${resepID}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return
      }
      console.log("recipe: ", res);
      result(null, res);
    });
  }

  static create(resep, result) {
    sql.query('INSERT INTO resep SET ?', resep, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log('created resep: ', { id: res.insertId, ...resep });
      result(null, { id: res.insertId, ...resep });
      return;
    })
  }
}

module.exports = Resep;