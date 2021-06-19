const Transaksi = require("../Model/Transaksi.Model");
const Status = require("../Model/Status.Model");
const TransaksiProduk = require("../Model/Transaksi.Produk.Model");
const Resep = require("../Model/Resep.Model");
const BuktiPembayaran = require("../Model/BuktiPembayaran.Model");
const validasi = require("./Validasi");

exports.getAll = (req, res) => {
  Transaksi.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transaction."
      });
    else res.send(data);
  })
}

exports.getByStatus = (req, res) => {
  Transaksi.getByStatus(req.params.statusID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transaction with id ${req.params.nomorTR}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving transaction with id " + req.params.nomorTR
        });
      }
    } else res.send(data);
  })
}

exports.getFromPembeli = (req, res) => {
  Transaksi.getFromPembeli(req.params.pembeliID, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transaction."
      });
    else res.send(data);
  });
}

exports.getOne = (req, res) => {
  Transaksi.getOne(req.params.nomorTR, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transaction with id ${req.params.nomorTR}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving transaction with id " + req.params.nomorTR
        });
      }
    } else res.send(data);
  });
}

exports.insertProdukTransaksi = (req, res) => {
  const validated = validateProductTransaction(req.body.produk, res, true);
  if (!validated) { return; }
  let error = [];
  let sent_data = [];
  validated.forEach((data, i) => {
    const produk_transaksi = {
      nomor_transaksi: data.nomor_transaksi,
      id_produk: data.id_produk,
      jumlah: data.jumlah
    }
    TransaksiProduk.create(produk_transaksi, (err, data) => {
      if (err) {
        if (err.kind == 'exists') {
          error.push({
            status: 409,
            message: "Product exists within transaction : " + produk_transaksi.nomor_transaksi
          })
        } else {
          error.push({
            status: 500,
            message: "Some error occurred while creating the product transaction."
          })
        }
        if ((i + 1) == validated.length) {
          console.log("Error: ", error[0])
          res.status(error[0].status).send({
            message: error[0].message
          });
          return;
        }
      } else {
        sent_data.push(data);
        if ((i + 1) == validated.length) {
          Status.update(produk_transaksi.nomor_transaksi, 1, (err, data) => {
            console.log(sent_data);
            res.send(sent_data);
            return;
          })
        }
      }
    })
  })
}

exports.insertBukti = (req, res) => {
  const keys = ["nomor_transaksi", "img_path"];
  const types = ["number", "string"];
  const validated = validasi.Validasi(req.body, keys, types, true)
  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    })
    return;
  }
  BuktiPembayaran.create(validated, (err, data) => {
    if (err) {
      if (err.kind == 'exists') {
        res.status(409).send({
          message: "Bukti already exists with id transaction: " + validated.nomor_transaksi
        });
      } else {
        res.status(500).send({
          message: "Error creating bukti."
        });
      }
    } else res.send(data);
  })
}

exports.updateStatus = (req, res) => {
  const keys = ["status"];
  const types = ["number"];
  const validated = validasi.Validasi(req.body, keys, types, false)
  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    })
    return;
  }
  Status.update(req.params.nomorTR, validated, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found status with transaction id: ${req.params.nomorTR}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating status with transaction id " + req.params.nomorTR
        });
      }
    } else res.send(data);
  });
}

exports.updateDataPengiriman = (req, res) => {
  const keys = ["data_pengiriman"];
  const types = ["object"];
  const validated = validasi.Validasi(req.body, keys, types);
  Transaksi.update(req.params.nomorTR, validated, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transaction with id: ${req.params.nomorTR}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating transaction with id " + req.params.nomorTR
        });
      }
    } else res.send(data);

  })
}

exports.create = (req, res) => {
  const transaction = validate(req.body, true, res);
  if (!transaction) { return; }
  if (!validateProductTransaction(transaction.produk, res, false)) { return; }
  let result_data = {};
  const insertTransaction = (resolve, reject) => {
    let transaksi = {
      id_pembeli: transaction.id_pembeli,
      data_pengiriman: JSON.stringify(transaction.data_pengiriman),
    };
    Transaksi.create(transaksi, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            "Some error occurred while creating the transaction."
        });
      }
      result_data = data;
      resolve(data);
    })
  }
  const promise = new Promise(insertTransaction)
    .then(response => {
      const status = {
        nomor_transaksi: response.id,
        status: transaction.status,
        jenis: transaction.jenis,
        id_resep: null
      }
      const status_validated = validateStatus(status, true, res);
      return new Promise((resolve, reject) => {
        Status.create(status_validated, (err, data) => {
          if (err) {
            res.status(500).send({
              message: "Some error occurred while creating the status."
            });
            resolve(null);
          } else {
            resolve(data);
          }
        })
      })
    })
    .then(response => {
      if (!response) { console.log("RESPONSE", response); return; }
      console.log("Insert Products, Response: ", response);
      result_data.id_resep = null;
      result_data.status = response.status;
      result_data.jenis = response.jenis;
      let sent_data = [];
      transaction.produk.forEach((tr, i) => {
        const produk_transaksi = {
          nomor_transaksi: response.nomor_transaksi,
          id_produk: tr.id_produk,
          jumlah: tr.jumlah
        }
        TransaksiProduk.create(produk_transaksi, (err, data) => {
          if (err) {
            res.status(500).send({
              message:
                "Some error occurred while creating the product transaction."
            });
          }
          sent_data.push(data);
          if ((i + 1) == transaction.produk.length) {
            result_data.produk = sent_data;
            result_data.data_pengiriman = JSON.parse(result_data.data_pengiriman)
            console.log(result_data);
            res.send(result_data);
          }
        })
      })
    })
}

exports.createWithResep = (req, res) => {
  const transaction = validateWithResep(req.body, true, res);
  if (!transaction) { return; }
  let result_data = {};
  const insertTransaction = (resolve, reject) => {
    let transaksi = {
      id_pembeli: transaction.id_pembeli,
      data_pengiriman: JSON.stringify(transaction.data_pengiriman),
    };
    Transaksi.create(transaksi, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            "Some error occurred while creating the transaction."
        });
      }
      result_data = data;
      resolve(data);
    })
  }
  const promise = new Promise(insertTransaction)
    .then(response => {
      result_data = {
        nomor_transaksi: response.id,
        id_pembeli: response.id_pembeli,
        data_pengiriman: JSON.parse(response.data_pengiriman)
      };
      const resep = {
        id_pembeli: transaction.id_pembeli,
        img_path: transaction.foto_resep
      }
      return new Promise((resolve, reject) => {
        Resep.create(resep, (err, data) => {
          if (err) {
            res.status(500).send({
              message: "Some error occurred while creating the status."
            });
            return;
          } else {
            result_data.id_resep = data.id;
            result_data.foto_resep = data.img_path;
            result_data.produk = [];
            resolve(data);
          }
        })
      })

    })
    .then(response => {
      const status = {
        nomor_transaksi: result_data.nomor_transaksi,
        status: transaction.status,
        jenis: transaction.jenis,
        id_resep: response.id
      }
      const status_validated = validateStatus(status, true, res);
      Status.create(status_validated, (err, data) => {
        if (err) {
          res.status(500).send({
            message: "Some error occurred while creating the status."
          });
          return;
        } else {
          result_data.status = data.status;
          result_data.jenis = data.jenis;
          res.send(result_data);
          return;
        }
      })
    })
}

function validate(data, isPost, res) {
  const keys = ["id_pembeli", "data_pengiriman", "status", "jenis", "produk"];
  const types = ["number", "object", "number", "number", ["number", "object"]];
  const validated = validasi.Validasi(data, keys, types, isPost)
  if (validated.invalid) {
    if (validated.invalid) {
      res.status(400).send({
        message: validated.message
      });
      console.log(validated.message)
      return;
    }
  }
  console.log("Validasi Awal: ", validated);
  return validated;
}

function validateWithResep(data, isPost, res) {
  const keys = ["id_pembeli", "data_pengiriman", "status", "jenis", "foto_resep"];
  const types = ["number", "object", "number", "number", "string"];
  const validated = validasi.Validasi(data, keys, types, isPost)
  if (validated.invalid) {
    if (validated.invalid) {
      res.status(400).send({
        message: validated.message
      });
      console.log(validated.message)
      return;
    }
  }
  return validated;
}

function validateStatus(data, isPost, res) {
  let keys = ["nomor_transaksi", "status", "jenis", "id_resep"];
  let types = ["number", "number", "number", ["number", "object"]];
  const validated = validasi.Validasi(data, keys, types, isPost)
  if (validated.invalid) {
    if (validated.invalid) {
      res.status(400).send({
        message: validated.message
      });
      console.log(validated.message)
      return;
    }
  }
  return validated;
}

function validateProductTransaction(data, res, trExists) {
  let validated = [];
  let isValid = true;
  const keys = ["id_produk", "jumlah"];
  const types = ["number", "number"];
  if (trExists) {
    keys.push("nomor_transaksi");
    types.push("number")
  }
  data.forEach(d => {
    const valid = validasi.Validasi(d, keys, types, true)
    if (valid.invalid) {
      res.status(400).send({
        message: valid.message
      });
      console.log(valid.message)
      isValid = false;
      return;
    }
    validated.push(valid)
  })
  if (!isValid) { return isValid }
  return validated;
}