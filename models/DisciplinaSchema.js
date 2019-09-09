const mongoose = require('mongoose')

const disciplinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'o atributo nome é obrigatório']
  },
  codigo: {
    type: String,
    required: [true, 'o atributo codigo é obrigatório']
  },
  horarios: [{
    type: String,
    ref: 'disciplina',
    required: [true, 'o atributo horário é obrigatório']
  }]
}, { collection: 'disciplinacollection' })

module.exports = disciplinaSchema