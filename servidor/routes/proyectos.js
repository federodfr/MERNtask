const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const proyectoController = require('../controllers/proyectoController')

//Crea proyectos
//api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],  
    proyectoController.crearProyecto
);

router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

//Actualizar el proyecto via id
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],  
    proyectoController.actualizarProyecto
);

//Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);
module.exports = router;