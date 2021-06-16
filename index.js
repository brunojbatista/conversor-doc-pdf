const port = 5000;

var express = require('express');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs-extra');
var path = require('path');
var libre = require('libreoffice-convert');
var Utils = require('./assets/js/utils.js');
var download = require("./assets/js/download.js");
app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.listen().setTimeout(9999999999);


app.get('/', async (req, res) => {

    res.sendFile(__dirname + path.sep + "Views" + path.sep + "home" + path.sep + "index.html");

});

app.get("/assets/js/:filename", (req, res) => {

    let filename = req.params.filename;

    res.download(__dirname + path.sep + "assets" + path.sep + "js" + path.sep + filename);

});

app.post("/convert", async (req, res) => {

    var form = new formidable.IncomingForm();

    // console.log(form);

    form.parse(req, async function (err, fields, files) {

        // console.log(fields, files)

        var oldpath = files.document.path;
        var newpath = __dirname + path.sep + "DOCX" + path.sep + files.document.name;
        var filename = files.document.name;

        await Utils.removeFile(newpath);

        // console.log(oldpath, newpath);

        fs.move(oldpath, newpath, async (err) => {

            console.log("Baixado com sucesso........");

            const docxConverter = require('docx-pdf');

            converted_path = __dirname + path.sep + "PDF" + path.sep + files.document.name.replace(/\..*/g, '') + ".pdf";

            console.log(converted_path);

            await Utils.removeFile(converted_path);

            docxConverter(newpath, converted_path, (err, result) => {
                if (err) console.log(err);
                else res.download(converted_path);
            });

        });

    });

    // const docxConverter = require('docx-pdf');

    // docxConverter('./input.docx','./output.pdf', (err, result) => {
    // if (err) console.log(err);
    // else console.log(result); // writes to file for us
    // });

    // filename = "teste.pdf";

    // res.download(__dirname + path.sep + filename);

});


app.listen(process.env.PORT || port);