import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest'

import { GetUserProfileUseCase } from './get-user-pofile-use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemmoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

let sut: GetUserProfileUseCase
let usersRepository: InMemmoryUsersRepository

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemmoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('should be able to get user profile', async () => {
        const createdUser = await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('John Doe')


    })

    it('should not be able to to get user profile with wrong id', async () => {

        expect(() =>
            sut.execute({
                userId: 'non-existing-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)


    })

})