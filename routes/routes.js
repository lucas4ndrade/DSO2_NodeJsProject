var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// aluno
var alunoController = require('../controllers/AlunoController');
router.get('/alunos', alunoController.index);
router.get('/novoAluno', alunoController.newPage);
router.get('/editarAluno/:aluno_id', alunoController.editPage);
router.post('/aluno/:aluno_id', alunoController.update);
router.get('/aluno/:aluno_id', alunoController.view);
router.post('/aluno', alunoController.new);
router.get('/apagarAluno/:aluno_id', alunoController.delete);


// disciplina
var disciplinaController = require('../controllers/DisciplinaController');
router.get('/disciplinas', disciplinaController.index);
router.get('/novaDisciplina', function(req, res) {
  res.render('novaDisciplina');
});
router.get('/editarDisciplina/:disciplina_id', disciplinaController.editPage);
router.post('/disciplina/:disciplina_id', disciplinaController.update);
router.get('/disciplina/:disciplina_id', disciplinaController.view);
router.post('/disciplina', disciplinaController.new);
router.get('/apagarDisciplina/:disciplina_id', disciplinaController.delete);


module.exports = router;
