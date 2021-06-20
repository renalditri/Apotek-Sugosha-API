const multer = require('multer');

const buktiStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/bukti/');
  },
  filename: function (req, file, cb) {
    cb(null, `bukti-${file.originalname}`);
  }
});

const resepStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/resep/');
  },
  filename: function (req, file, cb) {
    cb(null, `resep-${file.originalname}`);
  }
});

const produkStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/produk/');
  },
  filename: function (req, file, cb) {
    cb(null, `produk-${file.originalname}`);
  }
});

const kategoriStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/kategori/');
  },
  filename: function (req, file, cb) {
    cb(null, `kategori-${file.originalname}`);
  }
});

const uploadBukti = multer({ storage: buktiStorage }).single('bukti');
const uploadResep = multer({ storage: resepStorage }).single('resep');
const uploadProduk = multer({ storage: produkStorage }).single('produk');
const uploadKategori = multer({ storage: kategoriStorage }).single('kategori');

module.exports = {
  uploadBukti,
  uploadResep,
  uploadProduk,
  uploadKategori
}