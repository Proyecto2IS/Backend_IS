const { Materia } = require('../models/MateriaModel');

exports.obtenerMaterias = async (req,res)=>{
  try{

    const materias = await Materia.findAll({
      attributes:['id','nombre']
    });

    res.json(materias);

  }catch(error){
    res.status(500).json({error:'Error obteniendo materias'});
  }
};
