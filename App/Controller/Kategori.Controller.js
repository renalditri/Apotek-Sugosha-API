const Kategori = require("../Model/Kategori.Model");
const validasi = require("./Validasi");

exports.getAll = (req, res) => {
  Kategori.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    else res.send(data);
  });
}

exports.getOne = (req, res) => {
  Kategori.getOne(req.params.kategoriID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found category with user id ${req.params.kategoriID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving category with user id " + req.params.kategoriID
        });
      }
    } else res.send(data);
  });
}

exports.create = (req, res) => {
  const keys = ["nama", "img_path", "tampil"];
  const types = ["string", "string", "boolean"];
  if (!req.body && !req.file) {
    res.status(400).send({
      message: "Error with data/files, please make sure your data is correct"
    })
    return;
  }
  req.body.img_path = req.file.path;
  const validated = validasi.Validasi(req.body, keys, types, true);
  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }

  Kategori.create(validated, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the category."
      });
    else res.send(data);
  })
}

exports.update = (req, res) => {
  if (req.body.tampil) {
    req.body.tampil = (typeof req.body.tampil === 'boolean') ? req.body.tampil :
      (req.body.tampil === 'true') ? true : (req.body.tampil === 'false') ? false : '';
  }
  const keys = ["nama", "img_path", "tampil"];
  const types = ["string", "string", "boolean"];
  const validated = validasi.Validasi(req.body, keys, types, false);
  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }

  Kategori.update(req.params.kategoriID, validated, (err, data) => {
    if (err)
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found kategori with id ${req.params.kategoriID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving kategori with id " + req.params.kategoriID
        });
      }
    else res.send(data);
  })
}