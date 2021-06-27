const sql = require("../../db");
const database = require("../../database");

class Kategori {
  constructor(kategori) {
    if (kategori.nama && kategori.nama != '' && typeof kategori.nama === 'string') {
      this.nama = kategori.nama;
    }
    if (kategori.img_path && kategori.img_path != '' && typeof kategori.img_path === 'string') {
      this.img_path = kategori.img_path;
    }
    if (kategori.tampil !== '' && (typeof kategori.tampil === 'boolean')) {
      this.tampil = kategori.tampil;
    }
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
        res.map(r => {
          if (r.tampil == 1) { r.tampil = true; return r; }
          else { r.tampil = false; return r; }
        })
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
    database.query(query)
      .then(res => {
        if (res.length) {
          res.map(r => {
            if (r.tampil == 1) { r.tampil = true; return r; }
            else { r.tampil = false; return r; }
          })
          return res;
        } else {
          result({ kind: "not_found" }, null);
          return false;
        }
      }, err => {
        console.log("error: ", err);
        result(err, null);
        return false;
      })
      .then(async res => {
        if (res) {
          const produk = await database.query(`
            SELECT 
            ktpr.id_produk, prdk.nama, prdk.harga, prdk.qty, prdk.satuan, prdk.deskripsi,
            prdk.img_path, prdk.last_updated
            FROM kategori_produk as ktpr
            INNER JOIN produk as prdk ON ktpr.id_produk = prdk.id_produk
            WHERE ktpr.id_kategori = ${kategoriID}
          `)
          res[0].produk = produk;
          console.log("Found category: ", res[0]);
          result(null, res[0]);
        }
      })
  }

  static create(newKategori, result) {
    sql.query('INSERT INTO kategori SET ?', newKategori, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log('created kategori: ', { id: res.insertId, ...newKategori });
      result(null, { id: res.insertId, ...newKategori });
      return;
    })
  }

  static update(kategoriID, newKategori, result) {
    sql.query('UPDATE kategori SET ? WHERE id_kategori = ?', [newKategori, kategoriID], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      if (res == null) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log('updated kategori: ', newKategori);
      result(null, { id: kategoriID, ...newKategori });
      return;
    })
  }
}

module.exports = Kategori;