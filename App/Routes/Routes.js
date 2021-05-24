module.exports = app => {
  const produk = require("../Controller/Produk.Controller");
  const pembeli = require("../Controller/Pembeli.Controller");
  const keranjang = require("../Controller/Keranjang.Controller");
  const kategori = require("../Controller/Kategori.Controller");
  const kategori_produk = require("../Controller/Kategori.Produk.Controller");
  const transaksi = require("../Controller/Transaksi.Controller");
  const transaksi_produk = require("../Controller/Transaksi.Produk.Controller");
  const resep = require("../Controller/Resep.Controller");
  const status = require("../Controller/Status.Controller");

  app.get("/produk", produk.getAll);
  app.get("/produk/:productID", produk.getOne);
  app.get("/pembeli", pembeli.getAll);
  app.get("/keranjang/:pembeliID", keranjang.getFromCustomer);
  app.get("/kategori", kategori.getAll);
  app.get("/kategori/:kategoriID", kategori.getOne);
  app.get("/kategori/:kategoriID/produk", kategori_produk.getFromCategory);
  app.get("/transaksi", transaksi.getAll);
  app.get("/transaksi/pembeli/:pembeliID", transaksi.getFromPembeli);
  app.get("/transaksi/:nomorTR", transaksi.getOne);
  app.get("/transaksi/produk/:nomorTR", transaksi_produk.getFromTransaksi);
  app.get("/resep/:resepID", resep.getOne);
  app.get("/status/:nomorTR", status.getFromTransaksi);
  app.get("/status/status/:statusID", status.getByStatus);
  app.get("/status", status.getAll);

}