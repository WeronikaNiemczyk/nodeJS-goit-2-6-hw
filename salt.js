const bcrypt = require("bcrypt");

const pass = "password";

const main = async () => {
  const salt = await bcrypt.genSaltSync(10);

  const hash = await bcrypt.hash(pass, salt);
  console.log(`salt: ${salt}`);
  console.log(`hash: ${hash}`);
  await verify(pass, hash);
};

const verify = async (pass, hash) => {
  const ourSalt = hash.slice(0, 29);
  console.log("ourSalt", ourSalt);
  const hashCompare = await bcrypt.hash(pass, ourSalt);
  console.log(`${pass} => hashCompare`, hash === hashCompare);
};
main();
