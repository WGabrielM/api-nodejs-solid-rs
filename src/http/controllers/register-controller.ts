import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"

import { RegisterService } from "@/services/register-service"
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const usersRespository = new PrismaUsersRepository()
        const registerService = new RegisterService(usersRespository)

        await registerService.execute({
            name, email, password
        })
    } catch (error) {
        return reply.status(409).send()
    }

    return reply.status(200).send({ message: "User Created" })
}