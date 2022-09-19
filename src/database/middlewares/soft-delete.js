export const softDeleteModels = ['customers', 'mailboxes']
export const softDeleteMiddleware = async (params, next, models) => {
  // Check incoming query type
  if (models.includes(params.model)) {

    if (params.action == 'delete') {
      // Delete queries
      // Change action to an update
      params.action = 'update'
      params.args['data'] = { deletedAt: Date.now() }
    }
    if (params.action == 'deleteMany') {
      // Delete many queries
      params.action = 'updateMany'
      if (params.args.data != undefined) {
        params.args.data['deletedAt'] = Date.now()
      } else {
        params.args['data'] = { deletedAt: Date.now() }
      }
    }
  }
  return next(params)
} 