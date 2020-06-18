const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisa si hay errores

    const errores = validationResult(req);

    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }
    //extraer email y password
    const { email, password } = req.body;

    try {
        //Busca un usuario que tenga el email pasado por el body
        let usuario =await Usuario.findOne({ email });

        //Si hay un mail igual ya cargado retorna un error 400
        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        //guardar el nuevo usuario
        usuario = new Usuario(req.body)

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt)

        //guardar usuario

        await usuario.save();

        //crear y firmar el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        //firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;
            res.json({ token });

        })

    } catch(error) {
        console.log(error);
        res.status(400).send('Hubo un error')
    }
}


//Get y delete de usuarios, no funiona mongo compass
exports.obtenerUsuarios = async (req, res) => {
    try{
        const usuarios = await Usuario.find();

        res.json(usuarios)

    } catch (error){
        console.log(error)
    }
}

exports.eliminarUsuario = async(req, res) => {
    try{
        console.log(req.params.id, req.body)
        await Usuario.findOneAndRemove({ _id : req.body.id})

        res.send('Usuario eliminado')
    }catch(error){
        console.log(error)
    }
}