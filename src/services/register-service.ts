import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UsersRespository } from "@/repositories/users-repository"

interface RegisterUserCaseRequest {
    name: string
    email: string
    password: string
}

export class RegisterService {

    constructor(private usersRepository: UsersRespository) { }

    async execute({ name, email, password }: RegisterUserCaseRequest) {

        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new Error('E-mail already exists.')
        }


        await this.usersRepository.create({
            name,
            email,
            password_hash,
        })
    }

}