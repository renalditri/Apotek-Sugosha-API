const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../db');
const dbconfig = require('../dbconfig');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp)

describe('/Delete API Test', () => {
  describe('/Delete satu produk dalam keranjang', () => {
    it('Kode status 200 bila id_produk dan id_pembeli ditemukan', (done) => {
      chai.request(server)
        .delete('/keranjang/2/1')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })

    it('Kode status 404 disertai property message di dalam response bila id_produk dan id_pembeli tidak ada', (done) => {
      chai.request(server)
        .delete('/keranjang/2/1')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        })
    })
  })

  
  describe('Delete semua produk dalam keranjang', () => {
    it('Kode status 200 bila id_produk dan id_pembeli ditemukan', (done) => {
      chai.request(server)
      .delete('/keranjang/2')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })

    it('Kode status 404 disertai property message di dalam response bila id_produk dan id_pembeli tidak ada', (done) => {
      chai.request(server)
      .delete('/keranjang/2')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        })
    })
  })

})