import { FastifyInstance } from 'fastify'

// Middlewares
import { verifyJwt } from '../middlewares/verify-jwt'

// Controllers
import { create } from '../controllers/vessels/create'
import { get } from '../controllers/vessels/get'
import { list } from '../controllers/vessels/list'

export async function vesselsRoutes(app: FastifyInstance) {
  // Todas as rotas abaixo exigirão autenticação
  app.addHook('onRequest', verifyJwt)

  // Rota para listar as embarcações do usuário logado
  app.get('/vessels', list)

  // Rota para ver detalhes de uma embarcação específica
  app.get('/vessels/:vesselId', get)

  // Rota para cadastrar uma nova embarcação
  app.post('/vessels', create)
}