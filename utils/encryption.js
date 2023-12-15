const CryptoJS = require("crypto-js");

const key = process.env.CRYPTR_KEY;

const iv = CryptoJS.lib.WordArray.random(16);

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, key, { iv }).toString();
};

const decryptData = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, key, { iv });
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encryptField: (value) => encryptData(value),
  decryptField: (value) => decryptData(value),
  encryptData,
  decryptData,
};
