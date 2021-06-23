const multer = require('multer');

function removeSpace(string) {
  const text = `${Date.now()}-${string.replace(" ", "-")}`
  return text;
}

const buktiStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/bukti/');
  },
  filename: function (req, file, cb) {
    cb(null, `bukti-${removeSpace(file.originalname)}`);
  }
});

const resepStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/resep/');
  },
  filename: function (req, file, cb) {
    cb(null, `resep-${removeSpace(file.originalname)}`);
  }
});

const produkStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/produk/');
  },
  filename: function (req, file, cb) {
    cb(null, `produk-${removeSpace(file.originalname)}`);
  }
});

const kategoriStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/kategori/');
  },
  filename: function (req, file, cb) {
    console.log(removeSpace(file.originalname))
    cb(null, `kategori-${removeSpace(file.originalname)}`);
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