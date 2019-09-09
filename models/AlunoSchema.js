const mongoose = require('mongoose')

const alunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'o atributo nome é obrigatório']
  },
  matricula: {
    type: String,
    required: [true, 'o atributo matrícula é obrigatório']
  },
  disciplinas_ok: [{
    type: mongoose.Schema.ObjectId,
    ref: 'disciplina'
  }],
  disciplinas_conflito: [{
    type: mongoose.Schema.ObjectId,
    ref: 'disciplina'
  }],
}, { collection: 'alunocollection' })

module.exports = alunoSchema