const Status = require("../Model/Status.Model");

exports.getAll = (req, res) => {
  Status.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transaction."
      });
    else res.send(data);
  })
}

exports.getByStatus = (req, res) => {
  Status.getByStatus(req.params.statusID, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transaction."
      });
    else res.send(data);
  })
}

exports.getFromTransaksi = (req, res) => {
  Status.getFromTransaksi(req.params.nomorTR, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transaction."
      });
    else res.send(data);
  })
}