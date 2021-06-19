const sql = require("../../db");
const database = require("../../database");

class Keranjang {
  constructor(keranjang) {
    this.id_pembeli = keranjang.id_pembeli;
    this.id_produk = keranjang.id_produk;
    this.jumlah = keranjang.jumlah;
  }

  static getFromCustomer(pembeliID, result) {
    const query =
      `
      SELECT 
      krnj.id_pembeli, pmbl.nama as nama_pembeli, prdk.id_produk, krnj.jumlah, 
      prdk.nama as nama_produk, prdk.harga, prdk.qty, prdk.satuan, prdk.img_path
      FROM keranjang as krnj 
      INNER JOIN pembeli as pmbl ON krnj.id_pembeli = pmbl.id_pembeli
      INNER JOIN produk as prdk ON krnj.id_produk = prdk.id_produk
      WHERE krnj.id_pembeli = ${pembeliID}
    `
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        let final = {};
        let produk = [];
        final.id_pembeli = res[0].id_pembeli;
        final.nama_pembeli = res[0].nama_pembeli;
        res.forEach(r => {
          produk.push({
            id_produk: r.id_produk,
            jumlah: r.jumlah,
            nama_produk: r.nama_produk,
            harga: r.harga,
            qty: r.qty,
            satuan: r.satuan,
            img_path: r.img_path,
          })
        })
        final.produk = produk;
        console.log("found produk: ", final);
        result(null, final);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
  }

  static create(newKeranjang, result) {
    database.query(`
    SELECT * FROM keranjang WHERE id_pembeli = ? AND id_produk = ?
    `, [newKeranjang.id_pembeli, newKeranjang.id_produk])
      .then(res => {
        if(!res.length) {
          sql.query('INSERT INTO keranjang SET ?', newKeranjang, (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
            console.log('created cart: ', { ...newKeranjang });
            result(null, { ...newKeranjang });
            return;
          })
        } else {
          result({ kind: "exists" }, null);
          return;
        }
      })
  }

  static update(pembeliID, produkID, newKeranjang, result) {
    sql.query(`
      UPDATE keranjang 
      SET ? WHERE id_pembeli = ? AND id_produk = ?
    `, [newKeranjang, pembeliID, produkID], (err, res) => {
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
      console.log('updated cart: ' + newKeranjang);
      result(null, { id_pembeli: pembeliID, id_produk: produkID, ...newKeranjang });
      return;
    })
  }

  static delete(pembeliID, productID, result) {
    database.query(`DELETE FROM keranjang WHERE id_pembeli = ${pembeliID} AND id_produk = ${productID}`)
      .then(res => {
        if (res.affectedRows == 0) {
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("deleted product cart with user id: " + pembeliID + " and product id: " + productID);
        result(null, res);
      }, err => {
        console.log("error: ", err);
        result(null, err);
        return;
      })

  }
}

module.exports = Keranjang;