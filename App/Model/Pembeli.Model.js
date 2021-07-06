const sql = require("../../db");
const config = require('../../config.json');
const jwt = require('jsonwebtoken');

class Pembeli {
  constructor(pembeli) {
    if(pembeli.nomor_telepon && pembeli.nomor_telepon != 0 && typeof parseInt(pembeli.nomor_telepon) === 'number') {
      this.nomor_telepon = pembeli.nomor_telepon;
    }
    if(pembeli.nama && pembeli.nama != '' && typeof pembeli.nama === 'string') {
      this.nama = pembeli.nama;
    }
    if(pembeli.tanggal_lahir && pembeli.tanggal_lahir != '' && typeof pembeli.tanggal_lahir === 'string') {
      this.tanggal_lahir = pembeli.tanggal_lahir;
    }
    if(pembeli.password && pembeli.password != '' && typeof pembeli.password === 'string') {
      this.password = pembeli.password;
    }
  }

  static getAll(result) {
    sql.query('SELECT * FROM pembeli', (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      res = res.map((r) => {
        r.tanggal_lahir = r.tanggal_lahir.toISOString().split("T")[0];
        delete r.password;
        r.saved_data = (r.saved_data !== '') ? JSON.stringify(r.saved_data) : r.saved_data;
        return r;
      })
      console.log('pembeli: ', res);
      result(null, res);
    });
  }

  static authenticate(pembeli, result) {
    sql.query(`SELECT * FROM pembeli WHERE nomor_telepon = ? AND password = ?`, [pembeli.nomor_telepon, pembeli.password], 
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if(res.length < 1) {
        result({ kind: "not_found" }, null)
        return;
      }
      res[0].tanggal_lahir = res[0].tanggal_lahir.toISOString().split("T")[0];
      res[0].saved_data = (res[0].saved_data !== '') ? JSON.parse(res[0].saved_data) : res[0].saved_data;
      delete res[0].password;
      const token = jwt.sign({ sub: res[0].id_pembeli }, config.secret, { expiresIn: '14d' });
      console.log('pembeli: ', res[0]);
      result(null, { token , ...res[0] });
    });
  }

  static create(newPembeli, result) {
    sql.query('INSERT INTO pembeli SET ?', newPembeli, (err, res) => {
      if(err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log(res);
      console.log('created pembeli: ', {id: res.insertId, ...newPembeli});
      result(null, {id: res.insertId, ...newPembeli});
      return;
    })
  }

  static update(pembeliID, newPembeli, result) {
    sql.query('UPDATE pembeli SET ? WHERE id_pembeli = ?', [newPembeli, pembeliID], (err, res) => {
      if(err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0 || res == null) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(res);
      console.log('updated pembeli: ' + newPembeli);
      result(null, {id: pembeliID, ...newPembeli});
      return;
    })
  }
}

module.exports = Pembeli;