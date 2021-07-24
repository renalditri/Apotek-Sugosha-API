const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { end } = require('../db');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp)

const testUpdateData = [
  {
    table: 'produk',
    idValid: 1,
    idInvalid: 1000,
    dataValid: {
      nama: "TEST UPDATE"
    },
    dataInvalid: {
      nama: false,
    }
  },
  {
    table: 'kategori',
    idValid: 1,
    idInvalid: 1000,
    dataValid: {
      nama: "TEST UPDATE"
    },
    dataInvalid: {
      nama: false,
    }
  },
  {
    table: 'produk',
    idValid: 1,
    idInvalid: 1000,
    dataValid: {
      nama: "TEST UPDATE"
    },
    dataInvalid: {
      nama: false,
    }
  },
  {
    table: 'status',
    idValid: 44,
    idInvalid: 1000,
    dataValid: {
      status: 0
    },
    dataInvalid: {
      status: false,
    }
  },
  {
    table: 'transaksi',
    idValid: 44,
    idInvalid: 1000,
    dataValid: {
      data_pengiriman: {
        kota: "Denpasar Selatan",
        alamat: "Jalan ahaha",
        pengiriman: "Gojek",
        nomor_telepon: "0888892"
      }
    },
    dataInvalid: {
      data_pengiriman: false,
    }
  },
  {
    table: 'pembeli',
    idValid: 4,
    idInvalid: 1000,
    dataValid: {
      nomor_telepon: "08162736492"
    },
    dataInvalid: {
      nomor_telepon: false,
    }
  },
  {
    table: 'admin',
    idValid: 1,
    idInvalid: 1000,
    dataValid: {
      nomor_telepon: "0812345678"
    },
    dataInvalid: {
      nomor_telepon: false,
    }
  },
]

let id_produk_transaksi;

describe('/PUT API Test', () => {
  testUpdateData.forEach(testData => {
    describe(`/PUT ${testData.table}`, () => {
      it(`Mengubah data ${testData.table} dengan ${testData.keyId} = ${testData.idValid}`, (done) => {
        chai.request(server)
          .put(`/${testData.table}/${testData.idValid}`)
          .send(testData.dataValid)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          })
      })

      it(`Menampilkan status error 404 bila id data pada tabel ${testData.table} tidak ditemukan`, (done) => {
        chai.request(server)
          .put(`/${testData.table}/${testData.idInvalid}`)
          .send(testData.dataValid)
          .end((err, res) => {
            console.log(res.body)
            console.log(err)
            res.should.have.status(404);
            done();
          })
      })

      
      it('Kode status 400 disertai property message di dalam response bila data put invalid', (done) => {
        chai.request(server)
          .put(`/${testData.table}/${testData.idValid}`)
          .send(testData.dataInvalid)
          .end((err, res) => {
            console.log(res.body)
            console.log(err)
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
          })
      })

      it('Kode status 400 disertai property message di dalam response bila data put kosong', (done) => {
        chai.request(server)
          .put(`/${testData.table}/${testData.idValid}`)
          .end((err, res) => {
            console.log(res.body)
            console.log(err)
            res.should.have.status(400);
            res.body.should.have.property('message');
            done();
          })
      })
    })
  })

  
  describe(`/PUT Keranjang`, () => {
    it(`Mengubah data keranjang dengan id_pembeli = 2 dan id_produk = 3`, (done) => {
      chai.request(server)
        .put(`/keranjang/2/3`)
        .send({ jumlah: 5 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })

    it(`Menampilkan status error 404 bila id_pembeli dan/atau id_produk tidak ditemukan`, (done) => {
      chai.request(server)
        .put(`/keranjang/100/100`)
        .send({ jumlah: 5 })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        })
    })

    
    it('Kode status 400 disertai property message di dalam response bila data put invalid', (done) => {
      chai.request(server)
        .put(`/keranjang/2/3`)
        .send({ jumlah: 'asd' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })

    it('Kode status 400 disertai property message di dalam response bila data put kosong', (done) => {
      chai.request(server)
        .put(`/keranjang/2/3`)
        .end((err, res) => {
          console.log(res.body)
          console.log(err)
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        })
    })
  })  

  //
  describe(`/PUT Cancel Transaksi`, () => {
    it(`Mengubah data status transaksi menjadi 5 (transaksi gagal)`, (done) => {
      chai.request(server)
        .put(`/transaksi/44/cancel`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })

    
    it(`Menampilkan status error 409 bila transaksi sudah dibatalkan atau selesai`, (done) => {
      chai.request(server)
        .put(`/transaksi/44/cancel`)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        })
    })

    it(`Menampilkan status error 404 bila id transaksi tidak ditemukan`, (done) => {
      chai.request(server)
        .put(`/transaksi/1000/cancel`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        })
    })
  })
})