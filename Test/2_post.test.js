const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { end } = require('../db');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp)

// ***transaksitanparesep, produk**transaksi, ***pembeli, ***keranjang, loginpembeli, loginadmin

const testData = [
  {
    table: 'transaksi',
    dataValid: {
      id_pembeli: 1,
      data_pengiriman: {
        kota: "Kabupaten Gianyar",
        alamat: "Jalan AsD nomor 9",
        pengiriman: "Gojek - bayar di tujuan ongkir min.  Rp10.000"
      },
      status: 2,
      jenis: 0,
      produk: [
        {
          id_produk: 1,
          jumlah: 6
        },
        {
          id_produk: 2,
          jumlah: 10
        }
      ]
    },
    dataInvalid: {
      id_pembeli: false,
      data_pengiriman: false,
      status: false,
      jenis: false,
      produk: false
    }
  },
  {
    table: 'pembeli',
    dataValid: {
      nama: 'Data Dummy',
      nomor_telepon: '09615237482',
      tanggal_lahir: '2001/05/22',
      password: 'tespassword'
    },
    dataInvalid: {
      nama: false,
      nomor_telepon: false,
      tanggal_lahir: false,
      password: false
    }
  },
  {
    table: 'keranjang',
    dataValid: {
      id_pembeli: 1,
      id_produk: 2,
      jumlah: 3,
    },
    dataInvalid: {
      id_pembeli: false,
      id_produk: false,
      jumlah: false,
    }
  }
]

let id_produk_transaksi;

describe('/POST API Test', () => {

  testData.forEach(data => {
    describe(`/POST ${data.table}`, () => {
      it('Kode status 200 bila data post benar', (done) => {
        chai.request(server)
          .post(`/${data.table}`)
          .send(data.dataValid)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          })
      })

      it('Kode status 400 disertai property message di dalam response bila data post invalid', (done) => {
        chai.request(server)
          .post(`/${data.table}`)
          .send(data.dataInvalid)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
          })
      })

      it('Kode status 400 disertai property message di dalam response bila data post kosong', (done) => {
        chai.request(server)
          .post(`/${data.table}`)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
          })
      })
    })
  })

  describe('/POST kategori', () => {
    it('Kode status 200 bila data post benar', (done) => {
      chai.request(server)
        .post('/kategori')
        .set('Content-Type', 'application/form-data')
        .field('nama', 'Data Test')
        .field('tampil', false)
        .attach('kategori', fs.readFileSync('E:/API/sugosha-api/Test/placeholder.jpg'), 'placeholder.jpg')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post invalid', (done) => {
      chai.request(server)
        .post('/kategori')
        .set('Content-Type', 'application/form-data')
        .field('nama', 'Data Test')
        .field('tampil', 'tes')
        .attach('kategori', fs.readFileSync('E:/API/sugosha-api/Test/placeholder.jpg'), 'placeholder.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post kosong', (done) => {
      chai.request(server)
        .post('/kategori')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })
  })

  // //POST produk

  describe('/POST produk', () => {
    it('Kode status 200 bila data post benar', (done) => {
      chai.request(server)
        .post('/produk')
        .set('Content-Type', 'application/form-data')
        .field('nama', 'Data Test')
        .field('harga', 1000)
        .field('qty', 100)
        .field('satuan', 'Data Test')
        .field('deskripsi', `{
          "Exp Date": "08/03/2024",
          "Manfaat": "asfasf",
          "Komposisi": "asfasfasfasf",
          "Aturan Pakai": "pakai",
          "Efek Samping": "efek"
        }`)
        .field('kategori', 1)
        .attach('produk', fs.readFileSync('E:/API/sugosha-api/Test/placeholder.jpg'), 'placeholder.jpg')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post invalid', (done) => {
      chai.request(server)
        .post('/produk')
        .field('nama', 'Data Test')
        .field('harga', 'asd')
        .field('qty', 100)
        .field('satuan', 'Data Test')
        .field('deskripsi', `{
          "Exp Date": "08/03/2024",
          "Manfaat": "asfasf",
          "Komposisi": "asfasfasfasf",
          "Aturan Pakai": "pakai",
          "Efek Samping": "efek"
        }`)
        .field('kategori', 1)
        .attach('produk', fs.readFileSync('E:/API/sugosha-api/Test/placeholder.jpg'), 'placeholder.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post kosong', (done) => {
      chai.request(server)
        .post('/produk')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })
  })

  // //POST resep

  describe('/POST Transaksi dengan resep', () => {
    it('Kode status 200 bila data post benar', (done) => {
      chai.request(server)
        .post('/transaksi/resep')
        .set('Content-Type', 'application/form-data')
        .field('id_pembeli', 3)
        .field('data_pengiriman', `{
          "kota": "tes",
          "alamat": "tes",
          "pengiriman": "tes",
          "nomor_telepon": "tes"
        }`)
        .field('status', 0)
        .field('jenis', 1)
        .attach('resep', fs.readFileSync('E:/API/sugosha-api/Test/placeholder.jpg'), 'placeholder.jpg')
        .end((err, res) => {
          id_produk_transaksi = res.body.nomor_transaksi
          res.should.have.status(200);
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post invalid', (done) => {
      chai.request(server)
        .post('/transaksi/resep')
        .set('Content-Type', 'application/form-data')
        .field('id_pembeli', 3)
        .field('data_pengiriman', `{
          "kota": "tes",
          "alamat": "tes",
          "pengiriman": "tes",
          "nomor_telepon": "tes"
        }`)
        .field('status', "asd")
        .field('jenis', 1)
        .attach('resep', fs.readFileSync('E:/API/sugosha-api/Test/placeholder.jpg'), 'placeholder.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post kosong', (done) => {
      chai.request(server)
        .post('/transaksi/resep')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })
  })

  // TES Produk Transaksi


  describe(`/POST Transaksi Produk`, () => {
    it('Kode status 200 bila data post benar', (done) => {
      chai.request(server)
        .post(`/transaksi/produk`)
        .send({
          produk: [
            {
              nomor_transaksi: id_produk_transaksi,
              id_produk: 2,
              jumlah: 4
            },
            {
              nomor_transaksi: id_produk_transaksi,
              id_produk: 3,
              jumlah: 8
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post invalid', (done) => {
      chai.request(server)
        .post(`/transaksi/produk`)
        .send({
          produk: [
            {
              nomor_transaksi: 'asd',
              id_produk: 'qwe',
              jumlah: 4
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post kosong', (done) => {
      chai.request(server)
        .post(`/transaksi/produk`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })
  })

  // //  TES Bukti

  describe('/POST bukti pembayaran', () => {
    it('Kode status 200 bila data post benar', (done) => {
      chai.request(server)
        .post('/upload/bukti')
        .set('Content-Type', 'application/form-data')
        .field('nomor_transaksi', id_produk_transaksi)
        .attach('bukti', fs.readFileSync('E:/API/sugosha-api/Test/placeholder.jpg'), 'placeholder.jpg')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post invalid', (done) => {
      chai.request(server)
        .post('/upload/bukti')
        .set('Content-Type', 'application/form-data')
        .field('nomor_transaksi', 'asdasdasd')
        .attach('bukti', fs.readFileSync('E:/API/sugosha-api/Test/placeholder.jpg'), 'placeholder.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data post kosong', (done) => {
      chai.request(server)
        .post('/upload/bukti')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })
  })
})

