const fs = require('fs-extra');

const fileExists = (url) => {

  try {

    if (fs.existsSync(url)) {
      //file exists
      return true;
    }

  } catch(err) {

    console.error(err)

  }

  return false;

}

const removeFile = (filename) => {

  return new Promise(
    (resolve) => {

      while (true) {

        if (!fileExists(filename)) return resolve(true);

        fs.removeSync(filename);

      }

    }
  );

}

const waitFile = (url, attempts = 15) => {

  const time = 1000;

  return new Promise(
    (resolve) => {

      let wf = setInterval(
        () => {

          if (fileExists(url)) {

            resolve(true);

          }

          attempts--;

          if (attempts <= 0) resolve(false);

        }, time
      );

    }
  );

}

module.exports = {
  fileExists,
  waitFile,
  removeFile
};
