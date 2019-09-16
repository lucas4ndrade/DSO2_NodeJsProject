const mongoose = require('mongoose');
Disciplina = require("../models/DisciplinaSchema");
var DisciplinaModel = mongoose.model('disciplinacollection', Disciplina, 'disciplinacollection');

// Index
exports.index = function (req, res) {
  DisciplinaModel.find({}).lean().exec(
    function (e, docs) {
        res.render('disciplinas', { "disciplinaslist": docs });
  });
};

// Create
exports.new = function (req, res) {
  var disciplina = new DisciplinaModel();

  disciplina.nome = req.body.nome;
  disciplina.codigo = req.body.codigo;
  var horariosObj = new Map();
  if(req.body.diaDaSemana_1) horariosObj.set('dia_1', req.body.diaDaSemana_1);
  if(req.body.horario_1)     horariosObj.set('hora_1', req.body.horario_1   );
  if(req.body.diaDaSemana_2) horariosObj.set('dia_2', req.body.diaDaSemana_2);
  if(req.body.horario_2)     horariosObj.set('hora_2', req.body.horario_2   );
  if(req.body.diaDaSemana_3) horariosObj.set('dia_3', req.body.diaDaSemana_3);
  if(req.body.horario_3)     horariosObj.set('hora_3', req.body.horario_3   );
  if(req.body.diaDaSemana_4) horariosObj.set('dia_4', req.body.diaDaSemana_4);
  if(req.body.horario_4)     horariosObj.set('hora_4', req.body.horario_4   );
  disciplina.horarios = horariosObj;

  disciplina.save(function (err) {
    if (err) {
      console.log("Error! " + err.message);
      return err;
    } else {
      console.log("Post saved");
      res.redirect("disciplinas");
    }
  });
  
};

// View
exports.view = function (req, res) {
  DisciplinaModel.findById(req.params.disciplina_id, function (err, disciplina) {
    res.render('disciplina', {'disciplina': disciplina});
  });
};

// Update
exports.update = function (req, res) {
  DisciplinaModel.findById(req.params.disciplina_id, function (err, disciplina) {
    
    if(req.body.nome) disciplina.nome = req.body.nome;
    if(req.body.codigo) disciplina.codigo = req.body.codigo;
    var horariosObj = new Map();
    if(req.body.diaDaSemana_1) horariosObj.set('dia_1', req.body.diaDaSemana_1);
    if(req.body.horario_1)     horariosObj.set('hora_1', req.body.horario_1   );
    if(req.body.diaDaSemana_2) horariosObj.set('dia_2', req.body.diaDaSemana_2);
    if(req.body.horario_2)     horariosObj.set('hora_2', req.body.horario_2   );
    if(req.body.diaDaSemana_3) horariosObj.set('dia_3', req.body.diaDaSemana_3);
    if(req.body.horario_3)     horariosObj.set('hora_3', req.body.horario_3   );
    if(req.body.diaDaSemana_4) horariosObj.set('dia_4', req.body.diaDaSemana_4);
    if(req.body.horario_4)     horariosObj.set('hora_4', req.body.horario_4   );
    disciplina.horarios = horariosObj;

    disciplina.save(function (err) {
      if (err) {
        console.log("Error! " + err.message);
        return err;
      } else {
        console.log("Put saved");
        res.redirect(disciplina._id);
      }
    });
   
  });
};

exports.editPage = function(req, res){
  DisciplinaModel.findById(req.params.disciplina_id).exec((e, disciplina)=>{
    var dias = [disciplina.horarios.get('dia_1'), disciplina.horarios.get('dia_2'), disciplina.horarios.get('dia_3'), disciplina.horarios.get('dia_4')]
    var horas = [disciplina.horarios.get('hora_1'), disciplina.horarios.get('hora_2'), disciplina.horarios.get('hora_3'), disciplina.horarios.get('hora_4')]
    res.render("editarDisciplina", {"disciplina": disciplina, 
                                    'dia_1': (dias[0] || ""),
                                    'dia_2': (dias[1] || ""),
                                    'dia_3': (dias[2] || ""),
                                    'dia_4': (dias[3] || ""),
                                    'horario_1': (horas[0] || ""),
                                    'horario_2': (horas[1] || ""),
                                    'horario_3': (horas[2] || ""),
                                    'horario_4': (horas[3] || "")});
  })
}

// Delete
exports.delete = function (req, res) {
  DisciplinaModel.remove({_id: req.params.disciplina_id}, function (err, disciplina) {
    DisciplinaModel.find({}).lean().exec(function (e, disciplinas) {
      res.render('disciplinas', { "disciplinaslist": disciplinas });
    });
  });
};