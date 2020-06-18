const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');
const Proyecto =  require('../models/Proyecto');

//crear  una tarea
exports.crearTarea = async (req, res) => {

    //valida si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array()})
    }



    try{

        //Extraer el proyecto y ver si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto)

        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'})
        }

        // verificar creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

        //crear la tarea 
        const tarea = new Tarea(req.body);
        await tarea.save();

        res.send({ tarea })

    } catch(error) {
        console.log(error),
        res.status(500).send('Hubo un error')
    }
    
}

exports.obtenerTareas = async(req, res) => {        

    try{
        //Extraer el proyecto y ver si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto)
        
        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'})
        }
        
        // verificar creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

        //obtener las tareas por peroyecto
        const tarea = await Tarea.find({ proyecto });
        res.json({ tarea });
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

exports.actualizarTarea = async (req, res) => {

    try{
        //Extraer el proyecto y ver si existe
        const { proyecto, nombre, estado } = req.body;

        let tarea = Tarea.findById(req.params.id)

        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no encontrada'})
        }
        
        // verificar creador del proyecto
        const existeProyecto = await Proyecto.findById(proyecto)

        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        };

        //crear un objeteo con una nueva info

        const nuevaTarea= {};

    
        if(nombre){
            nuevaTarea.nombre = nombre
        }

        if(estado){
            nuevaTarea.estado = estado
        }

        //guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {new: true })

        res.json({ tarea })

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

exports.eliminarTarea= async (req, res) => {
    try{
        //Extraer el proyecto y ver si existe
        const { proyecto } = req.body;

        let tarea = Tarea.findById(req.params.id)

        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no encontrada'})
        }
        
        // verificar creador del proyecto
        const existeProyecto = await Proyecto.findById(proyecto)

        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        };

        //eliminar la tarea
        await Tarea.findOneAndRemove({ _id: req.params.id })

        res.json({msg: "tarea eliminada"})

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}