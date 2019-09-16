const mongoose = require('mongoose')

const alunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'o atributo nome é obrigatório']
  },
  matricula: {
    type: String,
    unique: true,
    required: [true, 'o atributo matrícula é obrigatório']
  },
  disciplinas_ok: [{
    type: mongoose.Schema.ObjectId,
    ref: 'disciplinacollection'
  }],
  disciplinas_conflito: [{
    type: mongoose.Schema.ObjectId,
    ref: 'disciplinacollection'
  }],
}, { collection: 'alunocollection' })

module.exports = alunoSchema