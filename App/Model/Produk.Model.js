const sql = require("../../db");
const database = require("../../database");

class Produk {
  constructor(produk) {
    this.id_produk = produk.id_produk;
    this.nama = produk.nama;
    this.harga = produk.harga;
    this.qty = produk.qty;
    this.satuan = produk.satuan;
    this.deskripsi = produk.deskripsi;
    this.img_path = produk.img_path;
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

    database.query("SELECT * FROM produk" + params)
      .then(res => {
        row = res;
        let arr = [];
        row.forEach(async (r, i) => {
          const idProduk = r.id_produk;
          const row2 = await database.query(`
            SELECT ktgr.nama
            FROM produk as prdk
            INNER JOIN kategori_produk as ktpr ON ktpr.id_produk = prdk.id_produk
            INNER JOIN kategori as ktgr ON ktpr.id_kategori = ktgr.id_kategori
            WHERE prdk.id_produk = "${idProduk}"
          `);
          r.deskripsi = JSON.parse(r.deskripsi);
          arr.push(r);
          const arrRow = row2.map(key => {
            return key.nama;
          })
          arr[i].kategori = arrRow;
          if (i == (row.length - 1)) {
            console.log("Found products: ");
            console.log(arr);
            result(null, arr)
          };
        })
        return arr;
      })
    return;
  }


  static getOne(produkID, result) {
    sql.query(`SELECT * FROM produk WHERE id_produk = ${produkID}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        res[0].deskripsi = JSON.parse(res[0].deskripsi);
        console.log("found produk: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
  }

  static update(produkID, produk, result) {
    sql.query(
      "UPDATE produk SET nama = ?, harga = ?, qty = ?, satuan = ?, deskripsi = ? WHERE id_produk = ?",
      [produk.nama, produk.harga, produk.qty, produk.satuan, produk.deskripsi, produkID],
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

        console.log("updated product: ", { id: id, ...produk });
        result(null, { id: id, ...produk });
      }
    );
  }
}

module.exports = Produk;