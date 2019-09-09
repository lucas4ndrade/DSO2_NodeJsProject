var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// aluno
var alunoController = require('../controllers/AlunoController');
router.get('/alunos', alunoController.index)
router.get('/novoAluno', function(req, res) {
  res.render('novoAluno');
});
router.post('/aluno', alunoController.new)


// disciplina
var disciplinaController = require('../controllers/DisciplinaController');
router.get('/disciplinas', disciplinaController.index)
router.get('/novaDisciplina', function(req, res) {
  res.render('novaDisciplina');
});
router.post('/disciplina', disciplinaController.new)


module.exports = router;
