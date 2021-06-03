const sql = require("../../db");
const database = require("../../database");

class KategoriProduk {
  constructor(kategoriProduk) {
    this.id_produk = kategoriProduk.id_produk;
    this.id_kategori = kategoriProduk.id_kategori;
  }

  static getFromCategory(kategoriID, result) {
    database.query(`SELECT * FROM kategori WHERE id_kategori = ${kategoriID}`)
      .then(res => {
        let arr = [];
        if (!res.length) {
          result({ kind: "not_found" }, null);
          return;
        } else {
          res.map(async (r, i) => {
            const kategoriID = r.id_kategori;
            const row2 = await database.query(`
              SELECT 
              ktpr.id_produk, prdk.nama, prdk.harga, prdk.qty, prdk.satuan, prdk.deskripsi,
              prdk.img_path, prdk.last_updated
              FROM kategori_produk as ktpr
              INNER JOIN produk as prdk ON ktpr.id_produk = prdk.id_produk
              WHERE ktpr.id_kategori = ${kategoriID}
            `);
            row2.map(produk => {
              produk.deskripsi = JSON.parse(produk.deskripsi);
              produk.last_updated = produk.last_updated.toISOString().split("T")[0];
            })
            arr.push(r);
            arr[i].produk = row2;
            if (i == (res.length - 1)) {
              console.log("Found category: ");
              console.log(arr);
              result(null, arr)
              return;
            };
          })
        }
      })
    return;
  }

  static create() {

  }
}

module.exports = KategoriProduk;