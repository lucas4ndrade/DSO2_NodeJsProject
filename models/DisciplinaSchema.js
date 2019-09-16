const mongoose = require('mongoose')

const disciplinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'o atributo nome é obrigatório']
  },
  codigo: {
    type: String,
    unique: true,
    required: [true, 'o atributo codigo é obrigatório']
  },
  horarios: {
    type: Map,
    of: String,
    required: [true, 'o atributo horário é obrigatório']
  }
}, { collection: 'disciplinacollection' })

module.exports = disciplinaSchema