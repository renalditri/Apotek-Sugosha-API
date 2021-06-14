const Pembeli = require("../Model/Pembeli.Model");
const validasi = require("./Validasi");

exports.create = (req, res) => {
  const keys = ["nomor_telepon", "nama", "tanggal_lahir", "password"];
  const types = ["number", "string", "string", "string"];
  const validated = validasi.Validasi(req.body, keys, types, true);
  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }

  Pembeli.create(validated, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  })
}

exports.update = (req, res) => {
  const keys = ["nomor_telepon", "nama", "tanggal_lahir", "password"];
  const types = ["number", "string", "string", "string"];
  const validated = validasi.Validasi(req.body, keys, types, false);

  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }

  Pembeli.update(req.params.pembeliID, validated, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found pembeli with id ${req.params.pembeliID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving pembeli with id " + req.params.pembeliID
        });
      }
    }
    else res.send(data);
  })
}

exports.getAll = (req, res) => {
  Pembeli.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
}

exports.getOne = (req, res) => {
  Pembeli.getOne(req.params.pembeliID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.params.pembeliID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.params.pembeliID
        });
      }
    } else res.send(data);
  });
}
// exports.getOne = (req, res) => {
//   Pembeli.getOne(req.params.pembeliID, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found product with id ${req.params.productID}.`
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving product with id " + req.params.productID
//         });
//       }
//     } else res.send(data);
//   });
// }
