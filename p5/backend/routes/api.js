var express = require('express');
var upload = require('express-fileupload');

const { createWriteStream } = require('fs');
const { mkdir } = require('fs').promises;

var Service = require('../models/service');

const { spawn, fork } = require('child_process');

const path_makefiles = process.cwd() + '/uploads/services/';

var router = express.Router();

router.use(upload());

function pipeStream(from, to) {
    return new Promise((resolve, reject) => {
        from.on("error", reject);
        to.on("error", reject);
        to.on("finish", resolve);
        from.pipe(to);
    });
}

/**
 * GET - Obtiene informacion sobre un Algoritmo en especifico
 * 
 */
router.get('/get/:service', async (req, res, next) => {

    const name = req.params.service;

    var parameters = [];
    var results = [];

    try {
        Service.findOne({ name: name }, (err, doc) => {
            if (err) console.log(err);

            if (doc) {

                for ( param in doc.parameters ) {
                    parameters.push({
                        name: doc.parameters[param].name,
                        type: doc.parameters[param].type
                    })
                }

                for (result in doc.results) {
                    results.push({
                        date: doc.results[result].date,
                        vars: doc.results[result].vars,
                        result: doc.results[result].result
                    })
                }

                var response = {
                    service: name,
                    parameters: parameters,
                    results: results
                }

                res.status(200).json(response);
            } else {
                res.status(404).json({Error: "Service not found"});
            }

        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({Error: err.message});
    }

});

/**
 * GET - Obtiene informacion sobre todos los algoritmos
 * 
 */
router.get('/get/service/all', async (req, res, next) => {

    var services = [];

    try {
        Service.find({}, (err, documents) => {
            if (err) console.log(err);

            if (documents) {

                for ( doc in documents ) {

                    var parameters = [];
                    var results = [];

                    for ( param in documents[doc].parameters ) {
                        parameters.push({
                            name: documents[doc].parameters[param].name,
                            type: documents[doc].parameters[param].type
                        })
                    }

                    for (result in documents[doc].results) {
                        results.push({
                            date: documents[doc].results[result].date,
                            vars: documents[doc].results[result].vars,
                            result: documents[doc].results[result].result
                        })
                    }

                    services.push({
                        name: documents[doc].name,
                        parameters: parameters,
                        results: results
                    })

                }

                res.status(200).json(services);
            } 

        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({Error: err.message});
    }

});

/**
 * POST - Ejecuta un algoritmo y devuelve el resultado
 */
router.post('/post/:service', async (req, res, next) => {

    console.log(req.params);

    if (req.query.parameters) {
        const name = req.params.service;
        const input_parameters = req.query.parameters;
        const timestamp = Date.now();

        try {
            Service.findOne({ name: name }, async (err, doc) => {
                if (err) console.log(err);

                if (doc) {
                    console.log(doc);
                    let parameters = doc.parameters;

                    if (parameters.length === input_parameters.length) {
                        for ( param in parameters ) {

                            if (parameters[param].type == 'file') {
                                
                                let file = req.files.image;
                                let file_path = doc.path + 'assets/';
                                let file_name = timestamp + '.' + image.name.split('.')[1];

                                try {
                                    let stats = await stats(image_path);
                                } catch (err) {
                                    if (err.code != "ENOENT") throw err;
                                    await mkdir(doc.path + 'assets');
                                }
                                
                                await image.mv(file_path + file_name);
                            }

                        }

                    } else {
                        throw Error("Invalid number of parameters");
                    }
                }

            });
        } catch (err) {
            console.log(err.message);
            res.status(400).send({ Error: err.message });
        }
    } else {
        res.status(400).send({ Error: "No parameters specified" });
    }

    // const ls = spawn('mpirun', ['-np', '4', 'executables/mpi.run', 'executables/assets/image.jpeg', '2.5']);

    // ls.stdout.on('data', (data) => {
    //     res.send(`stdout: ${data}`);
    // });

});


/** 
 * PUT - Crea el algoritmo en la base de datos
 */
router.put('/put/service/:service', async (req, res, next) => {

    if (req.query.parameters) {
        console.log(req.params.service);

        const service = req.params.service;
        const values = req.query.parameters;

        try {

            const parameters = values.map(value => {
                var arr = value.split(',');
                if (arr.length > 2)
                    throw Error("Parameters wrongly formated");

                return { 'name': arr[0], 'type': arr[1] };
            })


            console.log(parameters);

            let path = path_makefiles + service + '/';

            var query = Service.where({ name: service });

            query.findOne(async (err, document) => {

                if (document) {

                    console.log(document);
                    res.status(304).send({ DocumentExists: "The specified service already exists" });

                } else {

                    var alg = new Service({
                        name: service,
                        path: path,
                        parameters: parameters,
                    })


                    await alg.save();

                    await mkdir(path)

                    res.status(204).send();
                }
            })

        } catch (err) {
            console.log(err.message);
            res.status(500).send({ Error: err.message });
        }
    } else {
        res.status(400).send({ Error: "No parameters specified" });
    }
})

/** 
 * PUT - Crea el archivo fuente del algoritmo :service en la base de datos
 */
router.put('/put/service/:service/source/:filename', async (req, res, next) => {

    console.log(req.params.service);
    console.log(req.params.filename);

    const service = req.params.service;
    const filename = req.params.filename;

    let path = path_makefiles + service + '/' + filename;

    try {
        await pipeStream(req, createWriteStream(path));
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }

})

/** 
 * PUT - Crea el Makefile del algoritmo :service en la base de datos
 */
router.put('/put/service/:service/makefile', async (req, res, next) => {

    console.log(req.params.service);

    const service = req.params.service;

    let path = path_makefiles + service + '/Makefile';

    try {
        await pipeStream(req, createWriteStream(path));
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }

    //console.log(req.files.src);
})

/**
 * DELETE - Borra un algoritmo de la base de datos
 */


module.exports = router;
