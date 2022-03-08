const express = require('express');
const app = express();
const projectModel = require('../models/project.model');
const sanitizer = require('sanitizer');
const { check } = require('express-validator');
let validation = [
    check('idProject').trim().escape(),
    check('name').rtrim().escape(),
    check('description').rtrim().escape(),
    check('estatus').rtrim().escape(),
    check('dateStart').toDate().trim().escape(),
    check('dateEnd').toDate().trim().escape(),
]

app.get('/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.query.idProject);
        sanitizer.normalizeRCData(req.query.idProject);
        sanitizer.sanitize(req.query.idProject);

        const idProject = req.query.idProject;
        if(idProject) req.queryMatch = { _id: idProject };
        
        const project = await projectModel.find({ ...req.queryMatch });
        if (project.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron los proyectos',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Proyectos encontrados correctamente',
                cont: {
                    project
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener los proyectos',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.post('/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.body);
        sanitizer.sanitize(req.body);

        const project = new projectModel(req.body);
        const projectFound = await projectModel.findOne({ 
            name: { $regex: `^${project.name}$`, $options: 'i' } 
        });
        if (projectFound){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: `Ya se encuentra un proyecto con el nombre ${project.name}`,
                cont: 0
            });
        }

        const addProject = await project.save();
        if (addProject.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo agregar el proyecto',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Proyecto agregado correctamente',
                cont: {
                    addProject
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al agregar el proyecto',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.put('/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.body);
        sanitizer.sanitize(req.body);
        sanitizer.escape(req.query.idProject);
        sanitizer.normalizeRCData(req.query.idProject);
        sanitizer.sanitize(req.query.idProject);

        const idProject = req.query.idProject;
        if (!idProject) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Se requiere del id del proyecto',
                cont: 0
            });
        }

        req.body._id = idProject;
        const projectFound = await projectModel.findById(idProject)
        if (!projectFound) {
            res.status(404).send({
                estatus: '400',
                err: true,
                msg: 'No existe el proyecto',
                cont: 0
            });
        }

        const newProject = new projectModel(req.body)
        const updatedProject = await projectModel.findByIdAndUpdate(
            idProject, { $set: newProject }, { new: true });
        if (!updatedProject) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo modificar el proyecto',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Proyecto modificado con exito',
                cont: {
                    updatedProject
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al modificar el proyecto',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.delete('/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.query.idProject);
        sanitizer.normalizeRCData(req.query.idProject);
        sanitizer.sanitize(req.query.idProject);

        const idProject = req.query.idProject;
        let blnActivo = req.query.blnActivo;
        if (idProject == '' || !idProject) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Se requiere el id del proyecto',
                cont: 0
            });
        }
        if(blnActivo == '' || !blnActivo){
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Se requiere del estatus',
                cont: 0
            });;
        }

        const projectFound = await projectModel.findById(idProject)
        if (!projectFound) {
            res.status(404).send({
                estatus: '400',
                err: true,
                msg: 'No existe el proyecto',
                cont: projectFound
            });
        }

        const updatedProject = await projectModel.findByIdAndUpdate(
            idProject, { $set: { blnActivo }}, { new: true }
        );
        if (!updatedProject) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo modificar el proyecto',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: `El proyecto fue ${blnActivo === 'true'? 'activada': 'eliminada'} correctamente.`,
                cont: {
                    updatedProject
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al modificar el proyecto',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

module.exports = app;