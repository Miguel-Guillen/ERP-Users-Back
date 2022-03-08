const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Se requiere del titulo']
    },
    description: {
        type: String,
        required: [true, 'Se requiere de la descripcion']
    },
    requeriments: {
        type: String,
        required: [true, 'Se requiere los requerimientos']
    },
    priority: {
        type: String,
        default: 'Medio'
    },
    estatus: {
        type: String,
        default: 'Por hacer'
    },
    dueDate: {
        type: Date,
        required: [true, 'Se requiere de la fecha de vencimiento']
    },
    idProject: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Se requiere el id del proyecto']
    },
    responsable: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Se requiere el id del empleado']
    },
    commentary: String,
    info: String,
    blnActivo: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "task"
});

module.exports = mongoose.model('Task', taskSchema);



