exports.Validasi = (datas, keys, types, isPost) => {
  let dataValidated = {};
  let count = 0;
  Object.entries(datas).forEach(([key, val]) => {
    const existKey = keys.indexOf(key);
    let valid = true;
    if (existKey >= 0) {
      if (types[existKey] === "number") {
        if (!isNaN(val)) { val = parseInt(val) }
        else { valid = false }
      }
      if (types[existKey] === "boolean") {
        val = (val === 'true') ? true : (val === 'false') ? false : val;
      }
      if (val === "null") { val = null }
      if (Array.isArray(types[existKey])) {
        let match = false;
        types[existKey].forEach(type => {
          if (type === "number") {
            if (!isNaN(val)) { val = parseInt(val) }
          }
          if (typeof val === type) {
            match = true;
            valid = true;
          }
        })
        if (match) {
          dataValidated[key] = val;
          count++;
        } else { valid = false }
      } else if (typeof val === types[existKey]) {
        dataValidated[key] = val;
        count++;
      } else { valid = false }
    } else { valid = false }
    if (!valid) {
      console.log(key + ' ' + val + ' ' + typeof val + ' ' + types[existKey]);
      dataValidated.invalid = true;
      dataValidated.message = "Data yang dikirim tidak valid, mohon dicek kembali"
      return;
    }
  })

  if (dataValidated.invalid) { return dataValidated }

  if (isPost) {
    if (count !== keys.length) {
      dataValidated.invalid = true;
      dataValidated.message = "Jumlah data tidak mencukupi, mohon diisi semua"
    }
  }

  if (count === 0) {
    dataValidated.invalid = true;
    dataValidated.message = "Data kosong, mohon diisi kembali"
  }

  return dataValidated;
}