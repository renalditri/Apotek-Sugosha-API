const chai = require('chai');
const chaiHttp = require('chai-http');
const { end } = require('../db');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp)

const testGetAll = ['produk', 'kategori', 'pembeli', 'transaksi'];

const testGetById = [
  {
    table: 'produk',
    keyId: 'id_produk',
    idValid: 1,
    idInvalid: 100
  },
  {
    table: 'kategori',
    keyId: 'id_kategori',
    idValid: 1,
    idInvalid: 100
  },
  {
    table: 'transaksi',
    keyId: 'nomor_transaksi',
    idValid: 1,
    idInvalid: 1000
  },
  {
    table: 'keranjang',
    keyId: 'id_pembeli',
    idValid: 1,
    idInvalid: 1000
  },
];

describe('/GET Test API', () => {

  describe('Test API Get All', () => {
    testGetAll.forEach(testName => {
      it(`Menampilkan semua ${testName}`, (done) => {
        chai.request(server)
          .get(`/${testName}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          })
      })
    })
  })


  describe('Test API Get By ID', () => {
    testGetById.forEach(testData => {
      describe(`/GET ${testData.table}`, () => {
        it(`Menampilkan ${testData.table} dengan ${testData.keyId} = ${testData.idValid}`, (done) => {
          chai.request(server)
            .get(`/${testData.table}/${testData.idValid}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property(`${testData.keyId}`);
              res.body[`${testData.keyId}`].should.equal(1);
              done();
            })
        })

        it(`Menampilkan status error 404 bila ${testData.keyId} pada tabel ${testData.table} tidak ditemukan`, (done) => {
          chai.request(server)
            .get(`/${testData.table}/${testData.idInvalid}`)
            .end((err, res) => {
              res.should.have.status(404);
              done();
            })
        })
      })
    })


    describe(`/GET Transaksi`, () => {
      it('Menampilkan transaksi dengan id_pembeli = 1', (done) => {
        chai.request(server)
          .get('/transaksi/pembeli/1')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].should.have.property('id_pembeli');
            res.body[0]['id_pembeli'].should.equal(1);
            done();
          })
      })

      it('Menampilkan status error 404 bila id_pembeli pada table transaksi tidak ditemukan', (done) => {
        chai.request(server)
          .get('/transaksi/pembeli/100')
          .end((err, res) => {
            res.should.have.status(404);
            done();
          })
      })
    })
  })
})