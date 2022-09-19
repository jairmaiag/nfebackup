class ServerError {
  constructor(stack) {
    this.error = 'Internal server error'
    this.name = 'ServerError'
    this.stack = stack
  }
}

export default ServerError
