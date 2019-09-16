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
  var horariosObj = new Map()
  horariosObj.set(req.body.diaDaSemana_1, req.body.horario_1)
  horariosObj.set(req.body.diaDaSemana_2, req.body.horario_2)
  horariosObj.set(req.body.diaDaSemana_3, req.body.horario_3)
  horariosObj.set(req.body.diaDaSemana_4, req.body.horario_4)
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
    if (err){
      res.send(err);
    }
    
    if(req.body.nome) disciplina.nome = req.body.nome;
    if(req.body.codigo) disciplina.codigo = req.body.codigo;
    if(req.body.horarios) disciplina.horarios = req.body.horarios;

    disciplina.save(function (err) {
      if (err){
        res.json(err);
      }

      res.status(200).json(disciplina);
    });
   
  });
};

exports.editPage = function(req, res){
  DisciplinaModel.findById(req.params.disciplina_id).exec((e, disciplina)=>{
    var dias = []
    var horas = []
    disciplina.horarios.forEach((dia, hora) => {
      dias = dias.concat(dia)
      horas = horas.concat(hora)
    });
    res.render("editarDisciplina", {"disciplina": disciplina, 'dia_1': (dias[0] || ""),'dia_2': (dias[1] || ""),'dia_3': (dias[2] || ""),'dia_4': (dias[3] || ""),'hora_1': (horas[0] || ""),'hora_2': (horas[1] || ""),'hora_3': (horas[2] || ""),'hora_4': (horas[3] || "")});
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