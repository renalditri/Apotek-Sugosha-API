const Pembeli = require("../Model/Pembeli.Model");

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
