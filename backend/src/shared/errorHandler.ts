import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export interface DomainError extends Error {
  statusCode?: number
}

export function errorHandler(error: FastifyError | DomainError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error)

  const statusCode = (error as DomainError).statusCode || 500
  const message = error.message || 'Internal Server Error'

  reply.status(statusCode).send({
    error: error.name || 'Error',
    message
  })
}
