import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"

import { RegisterUseCase } from "@/use-cases/register-use-case"
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const usersRespository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRespository)

        await registerUseCase.execute({
            name, email, password
        })
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message })
        }

        return reply.status(500).send() // TODO: fix me
    }

    return reply.status(200).send({ message: "User Created!" })
}