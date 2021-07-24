const Produk = require("../Model/Produk.Model");
const KategoriProduk = require("../Model/Kategori.Produk.Model");
const validasi = require("./Validasi");

exports.getAll = (req, res) => {
  Produk.getAll(req.query, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
}

exports.getOne = (req, res) => {
  Produk.getOne(req.params.productID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found product with id ${req.params.productID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving product with id " + req.params.productID
        });
      }
    } else res.send(data);
  });
}

exports.create = (req, res) => {
  if (!req.body || !req.file) {
    res.status(400).send({
      message: "Error with data/files, please make sure your data is correct"
    })
    return;
  }
  req.body.img_path = req.file.path;
  const validate = validateData(req.body, res, true);
  if (!validate) { return; }
  const promise = new Promise((resolve, reject) => {
    delete validate.kategori;
    const validated_product = validateProduct(validate, res, true)
    if (!validated_product) { return; }
    Produk.create(validated_product, (err, data) => {
      if (err) {
        reject("Error product insert");
        res.status(500).send({
          message:
            "Some error occurred while creating the product."
        });
      }
      resolve(data);
    })
  })
  promise.then(resolve => {
    let success_kategori = [];
    const validated_category = validateCategory(req.body.kategori, resolve.id, res, true);
    if (!validated_category) { return; }
    validated_category.forEach((val, i) => {
      KategoriProduk.create(val, (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              "Some error occurred while creating the category product."
          });
        }
        success_kategori.push(data);
        if ((i + 1) == validated_category.length) {
          resolve.kategori = success_kategori;
          console.log(resolve);
          res.send(resolve);
        }
      })
    })
  })
}

exports.update = (req, res) => {
  if (!req.body && !req.file) {
    res.status(400).send({
      message: "Error with data/files, please make sure your data is correct"
    })
    return;
  } else if(req.file) { req.body.img_path = req.file.path; }
  const productID = req.params.productID;
  let response = { id_produk: productID }
  const validate = validateData(req.body, res, false);
  if (!validate) {
    return;
  }
  const productExists = isProductExists(validate);
  const promise = new Promise((resolve, reject) => {
    let send_data = '';
    if (productExists) {
      delete validate.kategori;
      send_data = validateProduct(validate, res, false);
      if (!send_data) { return; }
    }
    Produk.update(productID, send_data, (err, data) => {
      if (err) {
        err.id = productID;
        err.isProduct = true;
        catchError(err);
        return;
      }
      response.produk = data;
      if (req.body.kategori) {
        resolve({ data: data, isCategory: true });
      }
      resolve({ data: data, isCategory: false })
    })
  })
    .then((resolve) => {
      if (!resolve.isCategory) {
        res.send(response);
        return;
      } else {
        resolve = resolve.data;
        const validatedCategory = validateCategory(req.body.kategori, productID, res);
        if (!validatedCategory) { return; }
        KategoriProduk.delete(productID, (err, data) => {
          if (err) {
            if (err.kind) {
              console.log(`Not found category product with id ${productID}.`)
            } else {
              console.log("Could not delete category product with id " + productID)
            }
          }
          response.kategori = []
          validatedCategory.forEach((cat, i) => {
            KategoriProduk.create(cat, (err, data) => {
              if (err) {
                catchError(err);
              } else {
                response.kategori.push(data);
                if (i + 1 === validatedCategory.length) {
                  console.log('Updated Data: ', response);
                  res.send(response);
                  return;
                }
              }
            })
          })
          return;
        })
      }
    })

  function catchError(err) {
    let errorFrom = 'product'
    if (!err.isProduct) {
      errorFrom = 'product category'
    }
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found ${errorFrom} with id ${err.id}.`
      });
    } else {
      res.status(500).send({
        message: `Error updating ${errorFrom} with id ${err.id}`
      });
    }
  }
}

function validateData(data, res, isPost) {
  const keys = ["nama", "harga", "qty", "satuan", "deskripsi", "img_path", "kategori"];
  const types = ["string", "number", "number", "string", ["string", "object"], "string", ["object", "number"]];
  const validated = validasi.Validasi(data, keys, types, isPost);
  if (validated.invalid) {
    res.status(400).send({
      message: validated.message
    });
    console.log(validated.message)
    return;
  }
  if (validated.deskripsi) {
    if (typeof validated.deskripsi === "object") {
      validated.deskripsi = JSON.stringify(validated.deskripsi)
    }
  }
  return validated;
}

function validateProduct(data, res, isPost) {
  const keys_product = ["nama", "harga", "qty", "satuan", "deskripsi", "img_path"];
  const types_product = ["string", "number", "number", "string", ["string", "object"], "string"];
  const validated_product = validasi.Validasi(data, keys_product, types_product, isPost);
  if (validated_product.invalid) {
    res.status(400).send({
      message: validated_product.message
    });
    console.log(validated_product.message)
    return;
  }
  return validated_product;
}

function validateCategory(update, productID, res, isPost) {
  let data = [];
  let valid = [];
  if (!Array.isArray(update)) {
    data.push(update);
  } else { data = update }
  data.forEach((kateg, i) => {
    const kategori = {
      id_produk: productID,
      id_kategori: kateg
    }
    const keys_cat = ["id_produk", "id_kategori"];
    const types_cat = ["number", "number"];
    const validated_categoryProduct = validasi.Validasi(kategori, keys_cat, types_cat, isPost);
    if (validated_categoryProduct.invalid) {
      res.status(400).send({
        message: validated_categoryProduct.message
      });
      console.log(validated_categoryProduct.message)
      return;
    }
    valid.push(validated_categoryProduct)
  })
  return valid;
}

function isProductExists(datas) {
  const keys_product = ["nama", "harga", "qty", "satuan", "deskripsi", "img_path"];
  let isExists = false;
  Object.entries(datas).forEach(([key, val]) => {
    if (keys_product.includes(key)) {
      isExists = true;
      return;
    }
  })
  return isExists;
}