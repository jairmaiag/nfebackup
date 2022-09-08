class EmailInUseError {
  constructor () {
    this.error = 'O e-mail recebido já está em uso'
    this.name = 'EmailInUseError'
  }
}

module.exports = EmailInUseError
