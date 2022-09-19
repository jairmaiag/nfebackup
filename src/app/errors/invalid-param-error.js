class InvalidParamError {
  constructor (paramName) {
    this.error = `Parâmetro inválido: ${paramName}`
    this.name = 'InvalidParamError'
  }
}

export default InvalidParamError
