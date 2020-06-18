const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId, //de tipo id
        ref: 'Usuario' //hace referencia al id de que modelo vamos a retornar, en este caso en usuario.id(Id geneado automaticamente por MongoDb)
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema)