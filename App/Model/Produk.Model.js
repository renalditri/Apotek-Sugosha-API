const sql = require("../../db");
const database = require("../../database");

class Produk {
  constructor(produk) {
    if (produk.nama && produk.nama != '') {
      this.nama = produk.nama;
    }
    if (produk.harga && parseInt(produk.harga) >= 0) {
      this.harga = parseInt(produk.harga);
    }
    if (produk.qty && parseInt(produk.qty) >= 0) {
      this.qty = produk.qty;
    }
    if (produk.satuan && produk.satuan != '') {
      this.satuan = produk.satuan;
    }
    if (produk.deskripsi && produk.deskripsi != '') {
      this.deskripsi = produk.deskripsi;
    }
    if (produk.img_path && produk.img_path != '') {
      this.img_path = produk.img_path;
    }
    if (produk.last_updated && produk.last_updated != '') {
      this.last_updated = produk.last_updated;
    }
  }

  static getAll(qparams, result) {
    let row;
    const min_stock = (qparams.min_stock !== null && Number.isInteger(parseInt(qparams.min_stock))) ?
      qparams.min_stock : '';
    const max_stock = (qparams.max_stock !== null && Number.isInteger(parseInt(qparams.max_stock))) ?
      qparams.max_stock : '';
    let params = '';
    if (min_stock !== "") {
      params += ` WHERE qty >= ${min_stock}`
      if (max_stock !== "") { params += ` AND qty <= ${max_stock}` }
    } else if (max_stock !== "") { params += ` WHERE qty <= ${max_stock}` }

    database.query("SELECT * FROM produk" + params + " ORDER BY nama")
      .then(res => {
        row = res;
        let arr = [];
        row.forEach(async (r, i) => {
          const idProduk = r.id_produk;
          const row2 = await database.query(`
            SELECT ktgr.id_kategori, ktgr.nama, ktgr.tampil
            FROM produk as prdk
            INNER JOIN kategori_produk as ktpr ON ktpr.id_produk = prdk.id_produk
            INNER JOIN kategori as ktgr ON ktpr.id_kategori = ktgr.id_kategori
            WHERE prdk.id_produk = "${idProduk}"
          `);
          row2.map(r => {
            if (r.tampil == 1) { r.tampil = true; return r; }
            else { r.tampil = false; return r; }
          })
          r.deskripsi = JSON.parse(r.deskripsi);
          r.last_updated = r.last_updated.toISOString().split("T")[0];
          arr.push(r);
          arr[i].kategori = row2;
          if (i == (row.length - 1)) {
            console.log("Found products: ", arr);
            result(null, arr)
          };
        })
        return arr;
      })
    return;
  }


  static getOne(produkID, result) {
    database.query(`SELECT * FROM produk WHERE id_produk = ${produkID}`)
      .then(async (res) => {
        if (res.length) {
          const row2 = await database.query(`
          SELECT ktgr.id_kategori, ktgr.nama, ktgr.tampil
          FROM produk as prdk
          INNER JOIN kategori_produk as ktpr ON ktpr.id_produk = prdk.id_produk
          INNER JOIN kategori as ktgr ON ktpr.id_kategori = ktgr.id_kategori
          WHERE prdk.id_produk = "${res[0].id_produk}"
        `);
          row2.map(r => {
            if (r.tampil == 1) { r.tampil = true; return r; }
            else { r.tampil = false; return r; }
          })
          res[0].kategori = row2;
          res[0].deskripsi = JSON.parse(res[0].deskripsi);
          console.log("found produk: ", res[0]);
          result(null, res[0]);
          return;
        } else {
          // not found Customer with the id
          result({ kind: "not_found" }, null);
          return;
        }
      })
    return;
  }

  static create(newProduk, result) {
    database.query('INSERT INTO produk SET ?, last_updated = now()', newProduk)
      .then(res => {
        console.log('created produk: ', { id: res.insertId, ...newProduk });
        result(null, { id: res.insertId, ...newProduk });
        return;
      }, err => {
        result(err, null);
        return;
      })
  }

  static update(produkID, produk, result) {
    if (!produk || produk == '') {
      sql.query(
        'UPDATE produk SET last_updated = now() WHERE id_produk = ?', produkID,
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
          console.log("updated product with id: " + produkID);
          result(null, { id: produkID });
          return;
        }
      );
    } else {
      sql.query(
        'UPDATE produk SET ?, last_updated = now() WHERE id_produk = ?',
        [produk, produkID],
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

          console.log("updated product: ", { id: produkID, ...produk });
          result(null, { id: produkID, ...produk });
        }
      );
    }
  }

  static updateQty(produkID, total, isAdd, result) {
    database.query('SELECT * FROM produk WHERE id_produk = ?', produkID)
      .then(data => {
        const currentQty = (isAdd) ? data[0].qty + total : data[0].qty - total;
        sql.query('UPDATE produk SET last_updated = now(), qty = ? WHERE id_produk = ?', [currentQty, produkID], (err, res) => {
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
          console.log("updated product with id: " + produkID);
          result(null, { id: produkID, prevQty: data[0].qty, nowQty: currentQty });
          return;
        })
      })
  }
}

module.exports = Produk;