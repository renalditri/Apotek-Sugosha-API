const Status = require("../Model/Status.Model");

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