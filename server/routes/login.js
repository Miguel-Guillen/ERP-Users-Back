const express = require('express');
const app = express();
const employeeModel = require('../models/employee.model');
const sanitizer = require('sanitizer');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check } = require('express-validator');
let validation = [
    check('email').isEmail().normalizeEmail().trim(),
    check('password').isHash().trim()
]

app.post('/', validation, async(req, res) => {
    try {
        if(!req.body.email || !req.body.password){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: `Se requiere el correo y la contraseña`,
                cont: 0
            });
        }

        sanitizer.escape(req.body);
        sanitizer.sanitize(req.body);
        sanitizer.normalizeRCData(req.body.email);
        sanitizer.normalizeRCData(req.body.password);

        const { email, password } = req.body
        const employeeFound = await employeeModel.findOne({ email });
        if (!employeeFound){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: `No se ha encuentra el empleado`,
                cont: 0
            });
        }

        const pass = await bycrypt.compare(password, employeeFound.password);        
        if(pass){
            const JWT_SECRET = '*19/13_17@24e78b2d';
            const token = jwt.sign({
                id: employeeFound._id,
                username: employeeFound.name
            }, JWT_SECRET);
            res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Inicio de sesion correctamente`,
                cont: {
                    employeeFound,
                    token
                }
            });
        }else {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: `Correo o contraseña incorrectos`,
                cont: 0
            });
        }
        

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al intentar loguearse',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

module.exports = app;