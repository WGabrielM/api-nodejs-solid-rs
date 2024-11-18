import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"

import { AuthenticateUseCase } from "@/use-cases/authenticate-use-case";
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const usersRespository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(usersRespository)

        await authenticateUseCase.execute({
            email, password
        })
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: error.message })
        }

        return reply.status(500).send() // TODO: fix me
    }

    return reply.status(200).send()
}