const sql = require("../../db");
const config = require('../../config.json');
const jwt = require('jsonwebtoken');

class Admin {
  static getAll(result) {
    sql.query('SELECT * FROM admin', (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      console.log('admin: ', res);
      result(null, res);
    });
  }

  static authenticate(admin, result) {
    sql.query(`SELECT * FROM admin WHERE nomor_telepon = ? AND password = ?`, [admin.nomor_telepon, admin.password], 
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
      const token = jwt.sign({ sub: res[0].id_admin }, config.secret, { expiresIn: '14d' });
      result(null, { token , ...res[0] });
    });
  }

  static updatePassword(adminID, newAdmin, password, result) {
    sql.query('UPDATE admin SET ? WHERE id_admin = ? AND password = ?', [newAdmin, adminID, password], (err, res) => {
      if(err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0 || res == null) {
        // not found admin with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(res);
      console.log('updated admin: ' + newAdmin);
      result(null, {id: adminID, ...newAdmin});
      return;
    })
  }

  

  static update(adminID, newAdmin, result) {
    sql.query('UPDATE admin SET ? WHERE id_admin = ?', [newAdmin, adminID], (err, res) => {
      if(err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0 || res == null) {
        // not found admin with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(res);
      console.log('updated admin: ' + newAdmin);
      result(null, {id: adminID, ...newAdmin});
      return;
    })
  }
}

module.exports = Admin;