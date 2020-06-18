const Proyecto = require('../models/Proyecto');
const { validationResult } =require('express-validator')

exports.crearProyecto = async (req, res) => {

    //valida si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array()})
    }

    try {
        const proyecto = new Proyecto(req.body);

        //guardar el creador

        proyecto.creador = req.usuario.id

        //guarda el proyecto
        proyecto.save()
        res.json(proyecto)
    } catch(error){
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

exports.obtenerProyectos = async (req, res) => {
    try{
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        res.json({ proyectos })
    } catch(error){
        console.log(error),
        res.status(500).send('Hubo un error')
    }
}

//actualiza un proyecto
exports.actualizarProyecto = async(req, res) => {

    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array()})
    }

    const { nombre } = req.body;
    const nuevoProyecto = {}

    if(nombre){
        nuevoProyecto.nombre = nombre
    }

    try{

        //revisar el id
        let proyecto = await Proyecto.findById(req.params.id)

        //si el proyecto existe
        if(!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado'})
        }

        // verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

        //actualizar
        proyecto = await Proyecto.findOneAndUpdate( { _id: req.params.id }, { $set : nuevoProyecto }, {new: true})
        res.json({ proyecto })

    } catch(error){
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}

//eliminaun proyecto por id
exports.eliminarProyecto = async (req, res) => {

    try{
        //revisar el id
        let proyecto = await Proyecto.findById(req.params.id)

        //si el proyecto existe
        if(!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado'})
        }
        
        // verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Proyecto eliminado'})
    } catch (error){
        console.log(error);
        res.status(500).send('error en el servidor')
    }
}

