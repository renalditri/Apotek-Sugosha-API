const Admin = require("../Model/Admin.Model");
const validasi = require("./Validasi");

exports.update = (req, res) => {
  if(!req.body.confirm_password) {
    res.status(401).send({
      message: "Tolong masukkan password anda"
    })
    return;
  }
  
  const password = req.body.confirm_password;
  delete req.body.confirm_password;

  const keys = ["nomor_telepon", "nama", "password"];
  const types = ["string", "string", "string"];
  const validated = validasi.Validasi(req.body, keys, types, false);

  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }

  Admin.update(req.params.adminID, validated, password, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Password atau nomor telepon anda salah.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving admin with id " + req.params.adminID
        });
      }
    }
    else res.send(data);
  })
}

exports.authenticate = (req, res) => {
  const keys = ["nomor_telepon", "password"];
  const types = ["number", "string"];
  const validated = validasi.Validasi(req.body, keys, types, false);
  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }
  Admin.authenticate(req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Nomor telepon atau password salah.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user"
        });
      }
    } else res.send(data);
  });
}