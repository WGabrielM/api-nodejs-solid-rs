import { User } from '@prisma/client';
import { UsersRespository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import bcryptjs from "bcryptjs";
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetUserProfileUseCaseRequest {
    userId: string
}

interface GetUserProfileUseCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(private usersRespository: UsersRespository) { }


    async execute({ userId }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.usersRespository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return {
            user,
        }


    }
}