const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Se requiere del nombre']
    },
    description: {
        type: String,
        required: [true, 'Se requiere de la descripcion']
    },
    estatus: {
        type: String,
        default: 'En progreso'
    },
    dateStart: {
        type: Date,
        required: [true, 'Se requiere la fecha de inicio del proyecto']
    },
    dateEnd: {
        type: Date,
        required: [true, 'Se requiere la fecha de cierre del proyecto']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "project"
});

module.exports = mongoose.model('Project', projectSchema);