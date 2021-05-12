const sql = require("../../db");

class Kategori {
  constructor(kategori) {
    this.id_kategori = kategori.id_kategori;
    this.nama = kategori.nama;
    this.img_path = kategori.img_path;
  }

  static getAll(result) {
    const query = `SELECT * FROM kategori`
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found categories: ", res);
        result(null, res);
        return;
      }

      // not found category with the id
      result({ kind: "not_found" }, null);
    });
  }

  static getOne(kategoriID, result) {
    const query = `SELECT * FROM kategori WHERE id_kategori = ${kategoriID}`
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found category: ", res);
        result(null, res);
        return;
      }

      // not found category with the id
      result({ kind: "not_found" }, null);
    });
  }

  static create() {

  }

  static update() {

  }
}

module.exports = Kategori;