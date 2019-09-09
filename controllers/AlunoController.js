Aluno = require('../models/alunoSchema.js');
Disciplina = require("../models/DisciplinaSchema");
const mongoose = require('mongoose')

// Index
exports.index = function (req, res) {
   var Alunos = mongoose.model('alunocollection', Aluno, 'alunocollection');
   Alunos.find({}).lean().exec(
      function (e, docs) {
         res.render('alunos', { "alunoslist": docs });
   });
};

// Create
exports.new = function (req, res) {

  var AlunoModel = mongoose.model('alunocollection', Aluno, 'alunocollection');
  var aluno = new AlunoModel();

  aluno.nome = req.body.nome;
  aluno.matricula = "2019" + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 10) + 1);
  if(req.body.disciplinas)[aluno.disciplinas_ok, aluno.disciplinas_conflito] = verifyDisciplinas(req.body.disciplinas);

  aluno.save(function (err) {
      if (err) {
          console.log("Error! " + err.message);
          return err;
      }
      else {
          console.log("Post saved");
          res.redirect("alunos");
      }
  });
};

// View
exports.view = function (req, res) {
  Aluno.findById(req.params.aluno_id, function (err, aluno) {
    if (err){
      res.status(404).send(err);
    }
    res.status(200).json(aluno);
  });
};

// Update
exports.update = function (req, res) {
  Aluno.findById(req.params.aluno_id, function (err, aluno) {
    if (err){
      res.status(404).send(err);
    }
    if (req.body.nome) aluno.nome = req.body.nome
    if (req.body.disciplinas) [aluno.disciplinas_ok, aluno.disciplinas_conflito] = verifyDisciplinas(req.body.disciplinas)
    
    aluno.save(function (err) {
      if (err){
        res.json(err);
      }

      res.status(200).json(aluno);
    });
  });
};

// Delete
exports.delete = function (req, res) {
  Aluno.remove({_id: req.params.aluno_id}, function (err, aluno) {
    if (err){
      res.status(404).send(err);
    }
    res.status(200);
  });
};

function verifyDisciplinas(disciplinas) {
  var disciplinasOk = []
  // Get nas disciplinas do aluno, recebendo os objetos
  disciplinas.forEach((disciplina_id)=>{
    Disciplina.findById(disciplina_id, function(err, disciplina){
        disciplinasOk.concat(disciplina)
    })
  })
  // Verifica conflitos
  disciplinasOk.reduce((acc, disciplina_x) => {
    disciplinasOk.forEach((disciplina_y)=>{
      // se não for a mesma disciplina...
      if(disciplina_x.codigo !== disciplina_y.codigo){
        // verifica se não possuem horários em conflito
        disciplina_x.horarios.forEach((horario)=>{
          if(disciplina_y.horarios.includes(horario)){
            // se achar conflito, adiciona as duas disciplinas ao array de disciplinas com conflito (se já não estiverem) e remove das disciplinas ok
            if(!acc[1].includes(disciplina_x)) {
              acc[1] = acc[1].concat(disciplina_x) 
              acc[0].splice(acc[0].indexOf(disciplina_x), 1)
            }
            if(!acc[1].includes(disciplina_y)){
              acc[1] = acc[1].concat(disciplina_y) 
              acc[0].splice(acc[0].indexOf(disciplina_y), 1)
            }
          }
        })
      }
    })
    return acc            // separa apenas os ObjectID
  }, [disciplinasOk, []]).reduce((acc, x) => [acc[0].concat(x[0]._id), acc[1].concat(x[1]._id)], [[],[]])
}