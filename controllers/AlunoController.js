const mongoose = require('mongoose');
Aluno = require('../models/AlunoSchema.js');
AlunoModel = mongoose.model('alunocollection', Aluno, 'alunocollection');
Disciplina = require("../models/DisciplinaSchema");
DisciplinaModel =  mongoose.model('disciplinacollection', Disciplina, 'disciplinacollection');

// Index
exports.index = function (req, res) {
  AlunoModel.find({}).lean().exec(function (e, docs) {
      res.render('alunos', { "alunoslist": docs });
  });
};

// Create
exports.new = function (req, res) {
  var aluno = new AlunoModel();

  aluno.nome = req.body.nome;
  aluno.matricula = "2019" + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 10) + 1);
  
  var disciplinasOk = [];
  DisciplinaModel.find({'_id': {$in: req.body.disciplinas}}, function(err, disciplinas){
    disciplinasOk = disciplinas
  }).then(()=>{
    // Verifica conflitos
    var disciplinas_separadas = disciplinasOk.reduce((acc, disciplina_x) => {
      disciplinasOk.forEach((disciplina_y)=>{
        // se não for a mesma disciplina...
        if(disciplina_x.codigo !== disciplina_y.codigo){
          // verifica se não possuem horários em conflito
          // salva os horários em um array de map para facilitar a verificação, no estilo:
          //  [
          //    Map(a -> 1)
          //    Map(b -> 2)
          //    Map(c -> 3)
          //  ]
          //  Para que as chaves (dias da semana) possam ser duplicadas no Map.
          //  O map facilita a função de verificar conflitos
          var horarios_x = disciplina_x.horarios;
          var horarios_x_map = [];
          if(horarios_x.get('dia_1') && horarios_x.get('hora_1')) horarios_x_map.concat(new Map([[horarios_x.get('dia_1'), horarios_x.get('hora_1')]]));
          if(horarios_x.get('dia_2') && horarios_x.get('hora_2')) horarios_x_map.concat(new Map([[horarios_x.get('dia_2'), horarios_x.get('hora_2')]]));
          if(horarios_x.get('dia_3') && horarios_x.get('hora_3')) horarios_x_map.concat(new Map([[horarios_x.get('dia_3'), horarios_x.get('hora_3')]]));
          if(horarios_x.get('dia_4') && horarios_x.get('hora_4')) horarios_x_map.concat(new Map([[horarios_x.get('dia_4'), horarios_x.get('hora_4')]]));

          var horarios_y = disciplina_y.horarios;
          var horarios_y_map = [];
          if(horarios_y.get('dia_1') && horarios_y.get('hora_1')) horarios_y_map.concat(new Map([[horarios_y.get('dia_1'), horarios_y.get('hora_1')]]));
          if(horarios_y.get('dia_2') && horarios_y.get('hora_2')) horarios_y_map.concat(new Map([[horarios_y.get('dia_2'), horarios_y.get('hora_2')]]));
          if(horarios_y.get('dia_3') && horarios_y.get('hora_3')) horarios_y_map.concat(new Map([[horarios_y.get('dia_3'), horarios_y.get('hora_3')]]));
          if(horarios_y.get('dia_4') && horarios_y.get('hora_4')) horarios_y_map.concat(new Map([[horarios_y.get('dia_4'), horarios_y.get('hora_4')]]));

          horarios_x_map.forEach( map_x => map_x.forEach((hora_x, dia_x) => {
            horarios_y_map.forEach( map_y => {
              // se possuem conflito e se as disciplinas já não estão no array de conflito, adiciona elas ao array, e remove do array de disciplinas ok
              if(map_y.get(dia_x) === hora_x){
                if(!acc[1].includes(disciplina_x)){
                  acc[0].splice(acc[0].indexOf(disciplina_x), 1);
                  acc[1] = acc[1].concat(disciplina_x);
                }
                if(!acc[1].includes(disciplina_y)){
                  acc[0].splice(acc[0].indexOf(disciplina_y), 1);
                  acc[1] = acc[1].concat(disciplina_y);
                }
              }
            })
          }))
        }
      })
      return acc            
    }, [disciplinasOk, []])

    // separa os objectId das disciplinas para salvar no aluno
    aluno.disciplinas_ok = disciplinas_separadas[0].reduce((acc, x) => {return acc.concat(x._id)}, []);
    aluno.disciplinas_conflito = disciplinas_separadas[1].reduce((acc, x) => {return acc.concat(x._id)}, []);
    aluno.save(function (err, aluno) {
      if (err) {
        console.log("Error! " + err.message);
        return err;
      }else{
        console.log("Post saved");
        res.redirect("/aluno/"+aluno._id);
      }
    });
  })
  
};


exports.newPage = function(req, res){
  DisciplinaModel.find({}).lean().exec((e, disciplinas) => {
    res.render("novoAluno", {"disciplinas": disciplinas});
  });
}

// View
exports.view = function (req, res) {
  AlunoModel.findById(req.params.aluno_id).populate('disciplinas_ok').populate('disciplinas_conflito').exec((e, aluno)=>{
    res.render('aluno', {'aluno': aluno});
  });
};

// Update
exports.update = function (req, res) {
  AlunoModel.findById(req.params.aluno_id, function (err, aluno) {
    if (req.body.nome) aluno.nome = req.body.nome
    var disciplinasOk = [];
    DisciplinaModel.find({'_id': {$in: req.body.disciplinas}}, function(err, disciplinas){
      disciplinasOk = disciplinas
    }).then(()=>{
      // Verifica conflitos
      var disciplinas_separadas = disciplinasOk.reduce((acc, disciplina_x) => {
        disciplinasOk.forEach((disciplina_y)=>{
          // se não for a mesma disciplina...
          if(disciplina_x.codigo !== disciplina_y.codigo){
            // verifica se não possuem horários em conflito
            // salva os horários em um array de map para facilitar a verificação, no estilo:
            //  [
            //    Map(a -> 1)
            //    Map(b -> 2)
            //    Map(c -> 3)
            //  ]
            //  Para que as chaves (dias da semana) possam ser duplicadas no Map.
            //  O map facilita a função de verificar conflitos
            var horarios_x = disciplina_x.horarios;
            var horarios_x_map = [];
            if(horarios_x.get('dia_1') && horarios_x.get('hora_1')) horarios_x_map = horarios_x_map.concat(new Map([[horarios_x.get('dia_1'), horarios_x.get('hora_1')]]));
            if(horarios_x.get('dia_2') && horarios_x.get('hora_2')) horarios_x_map = horarios_x_map.concat(new Map([[horarios_x.get('dia_2'), horarios_x.get('hora_2')]]));
            if(horarios_x.get('dia_3') && horarios_x.get('hora_3')) horarios_x_map = horarios_x_map.concat(new Map([[horarios_x.get('dia_3'), horarios_x.get('hora_3')]]));
            if(horarios_x.get('dia_4') && horarios_x.get('hora_4')) horarios_x_map = horarios_x_map.concat(new Map([[horarios_x.get('dia_4'), horarios_x.get('hora_4')]]));

            var horarios_y = disciplina_y.horarios;
            var horarios_y_map = [];
            if(horarios_y.get('dia_1') && horarios_y.get('hora_1')) horarios_y_map = horarios_y_map.concat(new Map([[horarios_y.get('dia_1'), horarios_y.get('hora_1')]]));
            if(horarios_y.get('dia_2') && horarios_y.get('hora_2')) horarios_y_map = horarios_y_map.concat(new Map([[horarios_y.get('dia_2'), horarios_y.get('hora_2')]]));
            if(horarios_y.get('dia_3') && horarios_y.get('hora_3')) horarios_y_map = horarios_y_map.concat(new Map([[horarios_y.get('dia_3'), horarios_y.get('hora_3')]]));
            if(horarios_y.get('dia_4') && horarios_y.get('hora_4')) horarios_y_map = horarios_y_map.concat(new Map([[horarios_y.get('dia_4'), horarios_y.get('hora_4')]]));

            horarios_x_map.forEach( map_x => map_x.forEach((hora_x, dia_x) => {
              horarios_y_map.forEach( map_y => {
                // se possuem conflito e se as disciplinas já não estão no array de conflito, adiciona elas ao array, e remove do array de disciplinas ok
                if(map_y.get(dia_x) === hora_x){
                  if(!acc[1].includes(disciplina_x)){
                    acc[0].splice(acc[0].indexOf(disciplina_x), 1);
                    acc[1] = acc[1].concat(disciplina_x);
                  }
                  if(!acc[1].includes(disciplina_y)){
                    acc[0].splice(acc[0].indexOf(disciplina_y), 1);
                    acc[1] = acc[1].concat(disciplina_y);
                  }
                }
              })
            }))
          }
        })
        return acc            
      }, [disciplinasOk, []])

      // separa os objectId das disciplinas para salvar no aluno
      aluno.disciplinas_ok = disciplinas_separadas[0].reduce((acc, x) => {return acc.concat(x._id)}, []);
      aluno.disciplinas_conflito = disciplinas_separadas[1].reduce((acc, x) => {return acc.concat(x._id)}, []);
      aluno.save(function (err, aluno) {
        if (err) {
          console.log("Error! " + err.message);
          return err;
        }else{
          console.log("Post saved");
          res.redirect(aluno._id);
        }
      });
    })
    
  });
};

exports.editPage = function(req, res){
  AlunoModel.findById(req.params.aluno_id).populate('disciplinas_ok').populate('disciplinas_conflito').exec((e, aluno)=>{
    DisciplinaModel.find({}).lean().exec((e, disciplinas) => {
      res.render("editarAluno", {"aluno": aluno, "disciplinas": disciplinas});
    });
  })
}

// Delete
exports.delete = function (req, res) {
  AlunoModel.remove({_id: req.params.aluno_id}, function (err, aluno) {
    AlunoModel.find({}).lean().exec(function (e, docs) {
      res.render('alunos', { "alunoslist": docs });
    });
  });
};
