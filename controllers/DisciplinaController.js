Disciplina = require("../models/DisciplinaSchema");
const mongoose = require('mongoose')

// Index
exports.index = function (req, res) {
  var Disciplinas = mongoose.model('disciplinacollection', Disciplina, 'disciplinacollection');
   Disciplinas.find({}).lean().exec(
      function (e, docs) {
         res.render('disciplinas', { "disciplinaslist": docs });
   });
};

// Create
exports.new = function (req, res) {

  var DisciplinaModel = mongoose.model('disciplinacollection', Disciplina, 'disciplinacollection');
  var disciplina = new DisciplinaModel();

  disciplina.nome = req.body.nome;
  disciplina.codigo = req.body.codigo;
  disciplina.horarios = req.body.horarios;

  disciplina.save(function (err) {
      if (err) {
          console.log("Error! " + err.message);
          return err;
      }
      else {
          console.log("Post saved");
          res.redirect("disciplinas");
      }
  });
  
};

// View
exports.view = function (req, res) {
  Disciplina.findById(req.params.disciplina_id, function (err, disciplina) {
    if (err){
      res.status(404).send(err);
    }
    res.status(200).json(disciplina);
  });
};

// Update
exports.update = function (req, res) {
  Disciplina.findById(req.params.disciplina_id, function (err, disciplina) {
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

// Delete
exports.delete = function (req, res) {
  Disciplina.remove({_id: req.params.disciplina_id}, function (err, disciplina) {
    if (err){
      res.status(404).send(err);
    }

    res.status(200);
  });
};