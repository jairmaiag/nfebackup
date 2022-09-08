class MissingParamError {
  constructor (paramName) {
    this.error = `Ausência de parâmetro : ${paramName}`
    this.name = 'MissingParamError'
  }
}

module.exports = MissingParamError
