var express = require('express');
var upload = require('express-fileupload');
var admzip = require('adm-zip');
var node_ssh = require('node-ssh');

const { createWriteStream } = require('fs');
const { mkdir, stat } = require('fs').promises;

var Service = require('../models/service');

const path_makefiles = process.cwd() + '/uploads/services/';
const path_tmp = process.cwd() + '/uploads/tmp/';
const base_remote_path = '/home/ptondreau/Documents/services';

var jwt = require('jsonwebtoken');
var passport = require('passport');

const User = require('../models/user');

var router = express.Router();
var ssh = new node_ssh();

var ssh_config = {
    host: '192.168.1.41',
    username: 'ptondreau',
    privateKey: '/home/ptondreau/.ssh/id_rsa'
};

router.use(upload());

function pipeStream(from, to) {
    return new Promise((resolve, reject) => {
        from.on("error", reject);
        to.on("error", reject);
        to.on("finish", resolve);
        from.pipe(to);
    });
}

// Funciones para SSH
async function createRemoteDir(directory) {
    try {
        await ssh.exec('mkdir', [directory],
            {
                cwd: `${base_remote_path}`, // /mnt/nfs/services/ ...
                stream: 'stdout',
                options: { pty: true }
            });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getRemoteResult(service_name, base_name) {
    try {

        let result_file = '';

        var files = await ssh.exec('ls', [],
            {
                cwd: `${base_remote_path}/${service_name}/results/`,
                stream: 'stdout',
                options: { pty: true }
            });

        files = files.split('  ');

        console.log(files);

        for (i = 0; i < files.length; i++) {
            if (files[i].includes(base_name)) {
                let aux = files[i].split(/(\t|\r\n)/);
                for (j = 0; j < aux.length; j++) {
                    if (aux[j].includes(base_name)) {
                        result_file = aux[j];
                        break;
                    }
                }
            }
        }

        return result_file;

    } catch (err) {
        console.log(err);
        throw err;
    }
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

                for (param in doc.parameters) {
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
                    name: name,
                    description: doc.description,
                    parameters: parameters,
                    results: results
                }

                res.status(200).json(response);
            } else {
                res.status(404).json({ Error: "Service not found" });
            }

        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ Error: err.message });
    }

});

/**
 * GET - Obtiene un resultado en especifico de un servicio ejecutado
 * 
 */
router.get('/get/:service/result/:result', async (req, res, next) => {
    var service_name = req.params.service;
    var result_file = req.params.result;

    Service.findOne({ name: service_name }, async (err, doc) => {
        if (err) { console.log(err); res.send(500).json({ Error: err.message }) }
        if (doc) {
            try {
                var stats = await stat(`${doc.path}results/${result_file}`)
                res.sendFile(`${doc.path}results/${result_file}`);
            } catch (err) {
                console.log(err);
                res.status(404).json({ Error: "Result file doesnt exist" });
                // BUSCAR EL RESULTADO DE LA CONSOLA
            }
        }
    })
})

/**
 * GET - Obtiene todos los resultados de un servicio dado
 * 
 */
router.get('/get/:service/results', async (req, res, next) => {
    var service_name = req.params.service;
    var result_file = req.params.result;

    Service.findOne({ name: service_name }, async (err, doc) => {
        if (err) { console.log(err); res.send(500).json({ Error: err.message }) }
        if (doc) {
            var resultJSON = [];

            for (result in doc.results) {
                resultJSON.push({
                    date: doc.results[result].date,
                    vars: doc.results[result].vars,
                    result: doc.results[result].result
                })
            }

            res.status(200).json(resultJSON);
            // try {
            //     var stats = await stat(`${doc.path}results/${result_file}`)
            //     res.sendFile(`${doc.path}results/${result_file}`);
            // } catch (err) {
            //     console.log(err);
            //     res.status(404).json({ Error: "Result file doesnt exist" });
            //     // BUSCAR EL RESULTADO DE LA CONSOLA
            // }
        }
    })
})

/**
 * GET - Obtiene informacion sobre todos los algoritmos
 * 
 */
router.get('/get/service/all', async (req, res, next) => {

    var services = [];

    try {
        // Busca todos los servicios
        Service.find({}, (err, documents) => {
            if (err) console.log(err);

            if (documents) {

                for (doc in documents) {

                    var parameters = [];
                    var results = [];

                    for (param in documents[doc].parameters) {
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
                        description: documents[doc].description,
                        parameters: parameters,
                        results: results
                    })

                }

                // Devuelve en formato JSON todos los servicios en la BBDD
                res.status(200).json(services);
            }

        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ Error: err.message });
    }

});

/**
 * POST - Compila un servicio que tiene Makefile y archivo fuente
 */
router.post('/post/compile/:service', async (req, res, next) => {

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {

        if (err)
            console.log(err);
        if (info != undefined) {
            console.log(info.message);
            res.json({ Error: info.message });
        } else {
            if (user) {
                const name = req.params.service;

                try {
                    await ssh.connect(ssh_config);


                    let result_compile = await ssh.exec('make', ['build'],
                        {
                            cwd: `${base_remote_path}/${name}/`,
                            stream: 'stdout',
                            options: { pty: true }
                        });

                    res.status(200).json({ Result: result_compile });
                } catch (err) {
                    console.log(err);
                    res.status(500).json({ Error: err.message });
                }
            } else {
                res.status(401).json({ Error: "Unauthorized" });
            }

        }
    })(req, res, next);
})

/**
 * POST - Ejecuta un servicio y devuelve el resultado
 */
router.post('/post/:service', async (req, res, next) => {

    console.log(req.params);

    const name = req.params.service;
    const input_parameters = req.body;
    const timestamp = Date.now();

    console.log(input_parameters);

    try {
        Service.findOne({ name: name }, async (err, doc) => {
            if (err) console.log(err);

            if (doc) {

                // Parametros que se usaran para ejecutar el servicio
                let exec_params = ['run']

                for (param in doc.parameters) {

                    // TODO: Antes de hacer esto comprobar si los parametros son correctos

                    if (doc.parameters[param].type.toLowerCase() == 'file') {
                        // Preparamos la conexion SSH
                        await ssh.connect(ssh_config);

                        // Parametros del archivo que se recibe
                        let file = req.files[doc.parameters[param].name];
                        let file_path = doc.path + 'assets/';
                        let file_name = timestamp + '.' + file.name.split('.')[1];

                        // Almacenamos la imagen
                        await file.mv(file_path + file_name);

                        // Una vez guardada la imagen se envie al cluster
                        await ssh.putFile(file_path + file_name, `${base_remote_path}/${doc.name}/assets/${file_name}`) // '/mnt/nfs/services/' + doc.name + '/assets/'

                        exec_params.push(`${doc.parameters[param].name}=assets/${file_name}`);
                    } else {
                        // Parametro no es un archivo, no se realiza nada especial y se insertan
                        exec_params.push(`${doc.parameters[param].name}=${input_parameters[doc.parameters[param].name]}`)
                    }

                }

                if (exec_params.length == (doc.parameters.length + 1)) {
                    //console.log(exec_params)
                    exec_params.push(`result=results/${timestamp}`) // Temporal, hasta que se inserte el parametro result en la bbdd

                    console.log(exec_params);

                    var console_result = await ssh.exec('make', exec_params,
                        {
                            cwd: `${base_remote_path}/${doc.name}/`,
                            stream: 'stdout',
                            options: { pty: true }
                        });

                    // A lo mejor puede hacerse simplemente con un ls | grep (ahorramos el ciclo for)
                    let result_file = await getRemoteResult(doc.name, timestamp);

                    console.log("My File: " + result_file);

                    const result_path = doc.path + 'results/' + result_file;

                    await ssh.getFile(result_path, `${base_remote_path}/${doc.name}/results/${result_file}`);

                    // Almacenar resultado en base de datos, tanto el resultado de la consola, como el resultado del algoritmo
                    doc.results.push({
                        date: Date(timestamp),
                        vars: exec_params,
                        result: {
                            console: console_result,
                            file: result_file
                        }
                    });

                    await doc.save();

                    res.status(200).json({
                        date: Date(timestamp),
                        vars: exec_params,
                        result: {
                            console: console_result,
                            file: result_file
                        }
                    })

                } else {
                    res.status(400).json({ Error: "Invalid number of parameters" })
                }

            } else {
                res.status(404).json({ Error: "Service not found" });
            }

        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ Error: err.message });
    }

});


/** 
 * PUT - Crea el servicio en la base de datos
 */
router.put('/put/service/:service', async (req, res, next) => {

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {

        if (err)
            console.log(err);
        if (info != undefined) {
            console.log(info.message);
            res.json({ Error: info.message });
        } else {
            console.log(user);
            if (user) {
                if (req.query.parameters) {
                    console.log(req.params.service);

                    const service = req.params.service;
                    const description = req.query.description;
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

                                await ssh.connect(ssh_config);

                                try {
                                    await mkdir(path)
                                    await mkdir(path + 'assets')
                                    await mkdir(path + 'results')
                                } catch (err) {
                                    console.log(err.message);
                                    res.status(500).json({ Error: err.message });
                                }

                                try {
                                    await createRemoteDir(service)
                                    await createRemoteDir(`${service}/assets`)
                                    await createRemoteDir(`${service}/results`)
                                } catch (err) {
                                    console.log(err.message);
                                    res.status(500).json({ Error: err.message });
                                }

                                var alg = new Service({
                                    name: service,
                                    description: description,
                                    path: path,
                                    parameters: parameters,
                                })


                                await alg.save();

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
            } else {
                res.status(401).json({ Error: "Unauthorized" });
            }
        }
    })(req, res, next);
})

/** 
 * PUT - Crea el archivo fuente del algoritmo :service en la base de datos
 */
router.put('/put/service/:service/source/:filename', async (req, res, next) => {

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {

        if (err)
            console.log(err);
        if (info != undefined) {
            console.log(info.message);
            res.json({ Error: info.message });
        } else {

            if (user) {
                const service = req.params.service;
                const filename = req.params.filename;

                if (filename.endsWith('.zip')) {

                    let path = path_makefiles + service + '/';
                    let path_zip = path_tmp + '/' + filename;


                    await pipeStream(req, createWriteStream(path_zip));
                    var zip = new admzip(path_zip);
                    zip.extractAllTo(path);

                    const failed = []
                    const successful = []
                    try {
                        await ssh.connect(ssh_config);
                        await ssh.putDirectory(path, `${base_remote_path}/${service}/`, {
                            recursive: true,
                            concurrency: 10,
                            tick: function (localPath, remotePath, error) {
                                if (error) {
                                    failed.push(localPath)
                                } else {
                                    successful.push(localPath)
                                }
                            }
                        })

                        console.log('failed transfers', failed.join(', '))
                        console.log('successful transfers', successful.join(', '))

                        res.status(200).send();

                    } catch (err) {
                        console.log(err);
                        res.status(500).send();
                    }
                    

                } else {
                    let path = path_makefiles + service + '/' + filename;

                    try {
                        await ssh.connect(ssh_config);
                        await pipeStream(req, createWriteStream(path));
                        await ssh.putFile(path, `${base_remote_path}/${service}/${filename}`)
                        res.status(200).send();
                    } catch (err) {
                        console.log(err);
                        res.status(500).send();
                    }
                }

            } else {
                res.status(401).json({ Error: "Unauthorized" });
            }
        }
    })(req, res, next);
})

/** 
 * PUT - Crea el Makefile del algoritmo :service en la base de datos
 */
router.put('/put/service/:service/makefile', async (req, res, next) => {

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {

        if (err)
            console.log(err);
        if (info != undefined) {
            console.log(info.message);
            res.json({ Error: info.message });
        } else {

            if (user) {
                const service = req.params.service;

                let path = path_makefiles + service + '/Makefile';

                try {
                    await ssh.connect(ssh_config);
                    await pipeStream(req, createWriteStream(path));
                    await ssh.putFile(path, `${base_remote_path}/${service}/Makefile`)
                    res.status(200).send();
                } catch (err) {
                    console.log(err);
                    res.status(500).send();
                }
            } else {
                res.status(401).json({ Error: "Unauthorized" });
            }
        }

    })(req, res, next);
})

/**
 * DELETE - Borra un algoritmo de la base de datos
 */


module.exports = router;
