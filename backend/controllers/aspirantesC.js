const jugador = require ('/..models/aspirantes');

async function registrarAspirantes(req, res) {

try {
const nuevoAspirante = await Aspirante.create(req.body);
const responseData = {mensaje: 'Registrado Exitosamente', aspirante: nuevoAspirante};

console.log('respondiendo con: ', JSON.stringify(responseData, null, 2));
res.status(201).json(responseData);
}catch(error) {
    console.error('Error al registrar aspirante:', error);
    const errorResponse = { mensaje: 'Error al registrar aspirante: ', error: error.message};
    console.log('Respondiendo con error: ', JSON.stringify(errorResponse, null, 2));
    res.status(500).json(errorResponse);

 }
}

async function obtenerAspiranteDni(req, res){

    const{dni} = req.params;
    try {
        const aspirante = await Aspirante.findOne({where: {dni: dni}});
    if(aspirante){
        res.status(200).json(aspirante);
    }else{
        res.status(404).json({mensaje: 'Aspirante no encontrado', error: error.message});
      }
    } catch (error){
        console.error('Error al obtener aspirante por dni ', error);
        res.status(500).json({mensaje: 'Error al obtener aspirante', error: error.message});
 }
}

module.exports = {registrarAspirantes, obtenerAspiranteDni};
