import crypto from "crypto";
const algorithm = "aes-256-cbc"; //Using AES encryption
import fs from "fs";
let key, iv;

function writeKeysToFile(key, iv, log = false) {
  fs.writeFileSync("./keys/iv.enc", iv.toString("hex"));
  fs.writeFileSync("./keys/key.enc", key.toString("hex"));
  if (log) {
    console.log("written iv:", iv);
    console.log("written key:", key);
  }
}

export function handleKeyAccess(req, res, next) {
  // the user want's new keys and also the keys are not found
  // if ( !readKeysFromFile()) {
  //   createAndSaveKeys();
  // }
  // inform the user that the keys are not found to place them or create new keys
  if (!readKeysFromFile()) {
    return false;
  }
  next();
  return true;
}

export function readKeysFromFile(log = false) {
  try {
    iv = Buffer.from(fs.readFileSync("./keys/iv.enc").toString(), "hex");
    key = Buffer.from(fs.readFileSync("./keys/key.enc").toString(), "hex");
    if (log) {
      console.log("read iv:", iv);
      console.log("read key:", key);
    }
    return true;
  } catch (error) {
    return false;
  }
}

export function createAndSaveKeys(log = true) {
  iv = crypto.randomBytes(16);
  key = crypto.randomBytes(32);
  writeKeysToFile(key, iv, log);
}

//Encrypting text
export function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

// Decrypting text
export function decrypt(text) {
  // return text;
  let ivLocal = Buffer.from(iv, "hex");
  let encryptedText = Buffer.from(String(text), "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivLocal);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
