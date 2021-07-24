const chai = require('chai');
const chaiHttp = require('chai-http');
const { end } = require('../db');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp)

describe('Autentikasi data login', () => {
  describe('Login User Pembeli', () => {
    it('Kode status 200 bila data post benar dan terdapat token dalam response', (done) => {
      chai.request(server)
        .post('/pembeli/login')
        .send({ nomor_telepon: '081247261843', password: 'agusasep' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          done();
        })
    })

    it('Kode status 404 disertai property message di dalam response bila data login invalid', (done) => {
      chai.request(server)
        .post('/pembeli/login')
        .send({ nomor_telepon: '081247261843', password: 'asd' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        })
    })
  })

  
  describe('Login User Admin', () => {
    it('Kode status 200 bila data post benar dan terdapat token dalam response', (done) => {
      chai.request(server)
        .post('/admin/login')
        .send({ nomor_telepon: '0812345678', password: '123' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          done();
        })
    })

    it('Kode status 404 disertai property message di dalam response bila data login invalid', (done) => {
      chai.request(server)
        .post('/admin/login')
        .send({ nomor_telepon: '081247261843', password: 'asd' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        })
    })
  })
})