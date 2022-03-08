const express = require('express');
const app = express();
const employeeModel = require('../models/employee.model');
const bcrypt = require('bcryptjs');
const sanitizer = require('sanitizer');
const { check } = require('express-validator');
let validation = [
    check('idEmployee').trim().escape(),
    check('name').rtrim().escape(),
    check('surnames').rtrim().escape(),
    check('job').rtrim().escape(),
    check('area').rtrim().escape(),
    check('email').isEmail().normalizeEmail().trim(),
    check('password').isString().trim(),
    check('rol').trim().escape(),
]

app.get('/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.query.idEmployee);
        sanitizer.normalizeRCData(req.query.idEmployee);
        sanitizer.sanitize(req.query.idEmployee);

        const idEmployee = req.query.idEmployee;
        if (idEmployee) req.queryMatch = { _id: idEmployee };
        // if (req.query.termino) req.queryMatch.$or = Helper(["strNombre", "strDireccion", "strUrlWeb"], req.query.termino);
        
        const employee = await employeeModel.find({ ...req.queryMatch });
        if (employee.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontro el empleado',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Empleado encontrado',
                cont: {
                    employee
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al buscar el empleado',
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

        req.body.password = await bcrypt.hash(req.body.password, 10);
        const employee = new employeeModel(req.body);
        const employeeFound = await employeeModel.findOne({ 
            email: { $regex: `^${employee.email}$`, $options: 'i' } 
        });
        if (employeeFound){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: `Ya se encuentra un empleado con el correo ${employee.email}`,
                cont: 0
            });
        }

        const addEmployee = await employee.save();
        if (addEmployee.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo agregar el empleado',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Empleado agregado correctamente',
                cont: addEmployee
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar empleado',
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
        sanitizer.escape(req.query.idEmployee);
        sanitizer.normalizeRCData(req.query.idEmployee);
        sanitizer.sanitize(req.query.idEmployee);

        const idEmployee = req.query.idEmployee;
        if (!idEmployee) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Se requiere del id del empleado',
                cont: 0
            });
        }

        req.body._id = idEmployee;
        const employeeFound = await employeeModel.findById(idEmployee)
        if (!employeeFound) {
            res.status(404).send({
                estatus: '400',
                err: true,
                msg: 'El empleado no existe',
                cont: 0
            });
        }

        req.body.password = await bcrypt.hash(req.body.password, 10);
        const newEmployee = new employeeModel(req.body)
        const updatedEmployee = await employeeModel.findByIdAndUpdate(
            idEmployee, { $set: newEmployee }, { new: true }
        );
        if (!updatedEmployee) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo modificar el empleado',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'El empleado fue actualizado correctamente',
                cont: updatedEmployee
            });
        }
        
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al modificar el empleado',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.delete('/', validation, async(req, res) => {
    try {
        sanitizer.escape(req.query.idEmployee);
        sanitizer.normalizeRCData(req.query.idEmployee);
        sanitizer.sanitize(req.query.idEmployee);

        const idEmployee = req.query.idEmployee;
        let blnActivo = req.query.blnActivo;
        if (idEmployee == '' || !idEmployee) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Se requiere del id del empleado',
                cont: 0
            });
        }
        if (blnActivo == '' || !blnActivo){
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Se requiere del estatus',
                cont: 0
            });
        }

        const employeeFound = await employeeModel.findById(idEmployee)
        if (!employeeFound) {
            res.status(404).send({
                estatus: '400',
                err: true,
                msg: 'El empleado no existe',
                cont: 0
            });
        }

        const updatedEmployee = await employeeModel.findByIdAndUpdate(
            idEmployee, { $set: { blnActivo }}, { new: true }
        );
        if (!updatedEmployee) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo modificar el empleado',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: `El empleado ha sido ${blnActivo === 'true' ? 'activado': 'eliminado'} correctamente`,
                cont: updatedEmployee
            });
        }
        
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al modificar el empleado',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

module.exports = app;