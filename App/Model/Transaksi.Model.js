const sql = require("../../db");
const database = require("../../database");

class Transaksi {
  constructor(transaksi) {
    this.nomor_transaksi = transaksi.nomor_transaksi;
    this.id_pembeli = transaksi.id_pembeli;
    this.data_pengiriman = transaksi.data_pengiriman;
  }

  static getAll(result) {
    let row;
    database.query(`
      SELECT
      trn.nomor_transaksi, trn.id_pembeli, sts.jenis, rsp.id_resep, rsp.img_path as foto_resep, sts.status,
      bkt.img_path as bukti_pembayaran, pmb.nama, pmb.nomor_telepon, trn.data_pengiriman, sts.last_updated
      FROM transaksi as trn
      INNER JOIN pembeli as pmb ON trn.id_pembeli = pmb.id_pembeli
      INNER JOIN status as sts ON trn.nomor_transaksi = sts.nomor_transaksi
      LEFT JOIN bukti_pembayaran as bkt ON trn.nomor_transaksi = bkt.nomor_transaksi
      LEFT JOIN resep as rsp ON sts.id_resep = rsp.id_resep
    `)
      .then(res => {
        row = res;
        let arr = [];
        row.forEach(async (r, i) => {
          let totalHarga = 0;
          const nomorTR = r.nomor_transaksi;
          const row2 = await database.query(`
          SELECT 
          pr.id_produk, pt.jumlah, pr.nama as nama_produk, pr.harga, pr.qty, pr.satuan, pr.img_path
          FROM produk_transaksi as pt
          INNER JOIN produk as pr ON pt.id_produk = pr.id_produk
          WHERE pt.nomor_transaksi = "${nomorTR}"
        `);
          row2.forEach(r => {
            totalHarga += (r.jumlah * r.harga);
          })
          r.data_pengiriman = JSON.parse(r.data_pengiriman);
          arr.push(r);
          arr[i].total = totalHarga;
          arr[i].produk = row2;
          if (i == (row.length - 1)) {
            console.log("Found transactions: ");
            console.log(arr);
            result(null, arr)
          };
        })
        return arr;
      })
    return;
  }

  static getByStatus(statusID, result) {
    let row;
    database.query(`
      SELECT
      trn.nomor_transaksi, trn.id_pembeli, sts.jenis, rsp.id_resep, rsp.img_path as foto_resep, sts.status,
      bkt.img_path as bukti_pembayaran, pmb.nama, pmb.nomor_telepon, trn.data_pengiriman, sts.last_updated
      FROM transaksi as trn
      INNER JOIN pembeli as pmb ON trn.id_pembeli = pmb.id_pembeli
      INNER JOIN status as sts ON trn.nomor_transaksi = sts.nomor_transaksi
      LEFT JOIN bukti_pembayaran as bkt ON trn.nomor_transaksi = bkt.nomor_transaksi
      LEFT JOIN resep as rsp ON sts.id_resep = rsp.id_resep
      WHERE sts.status = ${statusID}
    `)
      .then(res => {
        row = res;
        let arr = [];
        row.forEach(async (r, i) => {
          let totalHarga = 0;
          const nomorTR = r.nomor_transaksi;
          const row2 = await database.query(`
            SELECT 
            pr.id_produk, pt.jumlah, pr.nama as nama_produk, pr.harga, pr.qty, pr.satuan, pr.img_path
            FROM produk_transaksi as pt
            INNER JOIN produk as pr ON pt.id_produk = pr.id_produk
            WHERE pt.nomor_transaksi = "${nomorTR}"
          `);
          row2.forEach(r => {
            totalHarga += (r.jumlah * r.harga);
          })
          r.data_pengiriman = JSON.parse(r.data_pengiriman);
          arr.push(r);
          arr[i].total = totalHarga;
          arr[i].produk = row2;
          if (i == (row.length - 1)) {
            console.log("Found transactions: ");
            console.log(arr);
            result(null, arr)
          };
        })
        return arr;
      })
    return;
  }

  static getFromPembeli(pembeliID, result) {
    let row;
    database.query(`
      SELECT
      trn.nomor_transaksi, trn.id_pembeli, sts.jenis, rsp.id_resep, rsp.img_path as foto_resep, sts.status,
      bkt.img_path as bukti_pembayaran, pmb.nama, pmb.nomor_telepon, trn.data_pengiriman, sts.last_updated
      FROM transaksi as trn
      INNER JOIN pembeli as pmb ON trn.id_pembeli = pmb.id_pembeli
      INNER JOIN status as sts ON trn.nomor_transaksi = sts.nomor_transaksi
      LEFT JOIN bukti_pembayaran as bkt ON trn.nomor_transaksi = bkt.nomor_transaksi
      LEFT JOIN resep as rsp ON sts.id_resep = rsp.id_resep
      WHERE trn.id_pembeli = ${pembeliID}
    `)
      .then(res => {
        row = res;
        let arr = [];
        row.forEach(async (r, i) => {
          let totalHarga = 0;
          const nomorTR = r.nomor_transaksi;
          const row2 = await database.query(`
            SELECT 
            pr.id_produk, pt.jumlah, pr.nama as nama_produk, pr.harga, pr.qty, pr.satuan, pr.img_path
            FROM produk_transaksi as pt
            INNER JOIN produk as pr ON pt.id_produk = pr.id_produk
            WHERE pt.nomor_transaksi = "${nomorTR}"
          `);
          row2.forEach(r => {
            totalHarga += (r.jumlah * r.harga);
          })
          r.data_pengiriman = JSON.parse(r.data_pengiriman);
          arr.push(r);
          arr[i].total = totalHarga;
          arr[i].produk = row2;
          if (i == (row.length - 1)) {
            console.log("Found transactions: ");
            console.log(arr);
            result(null, arr)
          };
        })
        return arr;
      })
    return;
  }

  static getOne(nomorTR, result) {
    let row1, row2, row;
    database.query(`
      SELECT
      trn.nomor_transaksi, trn.id_pembeli, sts.jenis, rsp.id_resep, rsp.img_path as foto_resep, sts.status,
      bkt.img_path as bukti_pembayaran, pmb.nama, pmb.nomor_telepon, trn.data_pengiriman, sts.last_updated
      FROM transaksi as trn
      INNER JOIN pembeli as pmb ON trn.id_pembeli = pmb.id_pembeli
      INNER JOIN status as sts ON trn.nomor_transaksi = sts.nomor_transaksi
      LEFT JOIN bukti_pembayaran as bkt ON trn.nomor_transaksi = bkt.nomor_transaksi
      LEFT JOIN resep as rsp ON sts.id_resep = rsp.id_resep
      WHERE trn.nomor_transaksi = "${nomorTR}"
    `)
      .then(res => {
        if (res.length) {
          res[0].data_pengiriman = JSON.parse(res[0].data_pengiriman);
          row1 = res[0];
          return database.query(`
            SELECT 
            pr.id_produk, pt.jumlah, pr.nama as nama_produk, pr.harga, pr.qty, pr.satuan, pr.img_path
            FROM produk_transaksi as pt
            INNER JOIN produk as pr ON pt.id_produk = pr.id_produk
            WHERE pt.nomor_transaksi = "${nomorTR}"
          `);
        }
      })
      .then(res => {
        let totalHarga = 0;
        row2 = res;
        row = row1;
        if (row == null) {
          result({ kind: "not_found" }, null);
          return;
        }
        row2.forEach(r => {
          totalHarga += (r.jumlah * r.harga);
        })
        row.total = totalHarga;
        row.produk = row2;
        console.log("found transaction: ", row);
        result(null, row);
        return;
      })
    return;
  }

  static create(transaksi, result) {
    sql.query('INSERT INTO transaksi SET ?', transaksi, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log('created transaksi: ', { id: res.insertId, ...transaksi });
      result(null, { id: res.insertId, ...transaksi });
      return;
    })
  }

  static update(nomorTR, transaksi, result) {
    sql.query('UPDATE transaksi SET ? WHERE nomor_transaksi = ?', [transaksi, nomorTR], (err, res) => {
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

      console.log('updated status: ', transaksi);
      result(null, {id: nomorTR, ...transaksi});
      return;
    })
  }
}

module.exports = Transaksi;