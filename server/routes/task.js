const express = require('express');
const app = express();
const taskModel = require('../models/task.model');
const sanitizer = require('sanitizer');
const { check } = require('express-validator');
let validation = [
    check('idTask').trim().escape(),
    check('idProject').trim().escape(),
    check('title').rtrim().escape(),
    check('description').rtrim().escape(),
    check('requeriments').rtrim().escape(),
    check('priority').trim().escape(),
    check('estatus').trim().escape(),
    check('dueDate').toDate().trim().escape(),
    check('responsable').trim().escape(),
    check('commentary').rtrim().escape(),
    check('info').rtrim().escape(),
]

app.get('/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.query.idTask);
        sanitizer.normalizeRCData(req.query.idTask);
        sanitizer.sanitize(req.query.idTask);

        let queryFind;
        if (req.query.idTask){ 
            queryFind = { _id: req.query.idTask };
        }
        if (req.query.idProject){
            queryFind = { idProject: req.query.idProject };
        }
        if (req.query.responsable){
            queryFind = { responsable: req.query.responsable };
        }

        const task = await taskModel.find(queryFind);
        if (task.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontro la tarea',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Tareas encontrada',
                cont: {
                    task
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al buscar la tarea',
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

        const task = new taskModel(req.body);
        const taskFound = await taskModel.findOne({ 
            title: { $regex: `^${task.title}$`, $options: 'i' } 
        });
        if (taskFound){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: `Ya se encuentra una tarea con el nombre ${task.title}`,
                cont: 0
            });
        }

        const addTask = await task.save();
        if (addTask.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo agregar la tarea',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Tarea agregada correctamente',
                cont: {
                    addTask
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al insertar la tarea',
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
        sanitizer.escape(req.query.idTask);
        sanitizer.normalizeRCData(req.query.idTask);
        sanitizer.sanitize(req.query.idTask);

        const idTask = req.query.idTask;
        if (!idTask) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Se requiere del id de la tarea',
                cont: 0
            });
        }

        req.body._id = idTask;
        const taskFound = await taskModel.findById(idTask)
        if (!taskFound) {
            res.status(404).send({
                estatus: '400',
                err: true,
                msg: 'No se encontro la tarea',
                cont: 0
            });
        }

        const newTask = new taskModel(req.body)
        const updatedTask = await taskModel.findByIdAndUpdate(
            idTask, { $set: newTask }, { new: true }
        );
        if (!updatedTask) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo modificar la tarea',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'La tarea fue actualizada correctamente',
                cont: updatedTask
            });
        }
        
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al modificar la tarea',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.delete('/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.query.idTask);
        sanitizer.normalizeRCData(req.query.idTask);
        sanitizer.sanitize(req.query.idTask);

        const idTask = req.query.idTask;
        if (idTask == '' || !idTask) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Se requiere del id de la tarea',
                cont: 0
            });
        }

        const taskFound = await taskModel.findById(idTask);
        if (!taskFound) {
            res.status(404).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo encontrar la tarea',
                cont: 0
            });
        }

        const updatedTask = await taskModel.findByIdAndRemove(idTask);
        if (!updatedTask) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo modificar la tarea',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: `La tarea ha sido eliminada correctamente`,
                cont: updatedTask
            });
        }
        
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al modificar la tarea',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.get('/myTasks/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.query.id);
        sanitizer.normalizeRCData(req.query.id);
        sanitizer.sanitize(req.query.id);

        const id = req.query.id;
        if(!id){
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Se requiere el id del empleado',
                cont: 0
            });
        }
        
        const project = await taskModel.aggregate([
            { $lookup: {
                from: 'project',
                localField: 'idProject',
                foreignField: '_id',
                as: 'projects'
            }}
        ]);

        if (project.length == 0) {
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

module.exports = app;