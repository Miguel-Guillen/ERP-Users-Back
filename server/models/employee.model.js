const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Se requiere el nombre.']
    },
    surnames: {
        type: String,
        required: [true, 'Se requieren los apellidos.']
    },
    job: {
        type: String,
        required: [true, 'Se requiere el puesto de trabajo']
    },
    area: {
        type: String,
        required: [true, 'Se requiere el area de trabajo']
    },
    salary: {
        type: Number,
        required: [true, 'Se requiere el salario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Se requiere el correo']   
    },
    password: {
        type: String,
        required: [true, 'Se requiere la contraseña']
    },
    rol: {
        type: Number,
        required: [true, 'Se requiere el rol']
    },
    blnActivo: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "employee"
});

module.exports = mongoose.model('Employee', employeeSchema);