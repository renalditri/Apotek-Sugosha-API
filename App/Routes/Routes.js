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

  app.get("/pembeli", pembeli.getAll); 
  app.get("/pembeli/:pembeliID", pembeli.getOne);
  app.post("/pembeli", pembeli.create);
  app.put("/pembeli/:pembeliID", pembeli.update);

  app.get("/kategori", kategori.getAll);
  app.get("/kategori/:kategoriID", kategori.getOne);
  app.get("/kategori/produk/:productID", kategori_produk.getFromProduct); //produk jadi json
  app.post("/kategori", kategori.create);
  app.put("/kategori/:kategoriID", kategori.update);

  app.get("/keranjang/:pembeliID", keranjang.getFromCustomer); //produk jadi json
  app.post("/keranjang", keranjang.create);
  app.put("/keranjang/:pembeliID/:produkID", keranjang.update);

  app.post("/produk", produk.create);
  app.get("/produk", produk.getAll);
  app.get("/produk/:productID", produk.getOne);
  app.put("/produk/:productID", produk.update);
  
  app.get("/transaksi", transaksi.getAll);
  app.get("/transaksi/status/:statusID", transaksi.getByStatus);
  app.get("/transaksi/pembeli/:pembeliID", transaksi.getFromPembeli);
  app.get("/transaksi/:nomorTR", transaksi.getOne);
  app.get("/transaksi/produk/:nomorTR", transaksi_produk.getFromTransaksi);
  app.get("/resep/:resepID", resep.getOne);
  app.get("/status/:nomorTR", status.getFromTransaksi);
  app.get("/status/status/:statusID", status.getByStatus);
  app.get("/status", status.getAll);

}