const Resep = require("../Model/Resep.Model");

exports.getOne = (req, res) => {
  Resep.getOne(req.params.resepID, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving transaction."
      });
    else res.send(data);
  })
}