class InvalidParamError {
  constructor (paramName) {
    this.error = `Parâmetro inválido: ${paramName}`
    this.name = 'InvalidParamError'
  }
}

module.exports = InvalidParamError
