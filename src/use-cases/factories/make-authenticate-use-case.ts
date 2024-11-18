import { AuthenticateUseCase } from "../authenticate-use-case"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"

export function makeAuthenticateUseCase() {
    const usersRespository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRespository)

    return authenticateUseCase
}