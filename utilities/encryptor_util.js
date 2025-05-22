let crypto_js = require("crypto-js");

const encrypt = (plainPassword) => {
  let encLayer1 = crypto_js.AES.encrypt(
    plainPassword,
    process.env.PASSWORD_SECRET
  ).toString();
  let encLayer2 = crypto_js.DES.encrypt(
    encLayer1,
    process.env.PASSWORD_SECRET
  ).toString();
  let finalEncPassword = crypto_js.TripleDES.encrypt(
    encLayer2,
    process.env.PASSWORD_SECRET
  ).toString();
  return finalEncPassword;
};

const decrypt = (encryptedPassword, PASSWORD_SECRET = "") => {
  PASSWORD_SECRET = PASSWORD_SECRET || process.env.PASSWORD_SECRET;
  let decLayer1 = crypto_js.TripleDES.decrypt(
    encryptedPassword,
    PASSWORD_SECRET
  );
  let deciphertext1 = decLayer1.toString(crypto_js.enc.Utf8);

  let decLayer2 = crypto_js.DES.decrypt(deciphertext1, PASSWORD_SECRET);
  let deciphertext2 = decLayer2.toString(crypto_js.enc.Utf8);

  let decLayer3 = crypto_js.AES.decrypt(deciphertext2, PASSWORD_SECRET);
  let finalDecPassword = decLayer3.toString(crypto_js.enc.Utf8);
  return finalDecPassword;
};

module.exports = { encrypt, decrypt };
