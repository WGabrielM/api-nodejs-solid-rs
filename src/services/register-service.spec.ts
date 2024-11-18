import { expect, describe, it } from 'vitest'
import { RegisterService } from './register-service';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { compare } from 'bcryptjs';
import { InMemmoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Service', () => {
    it('should be able to register', async () => {
        const userRepository = new InMemmoryUsersRepository()
        const registerService = new RegisterService(userRepository)

        const { user } = await registerService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))


    })
    it('should hash user password upn registration', async () => {
        const userRepository = new InMemmoryUsersRepository()
        const registerService = new RegisterService(userRepository)

        const { user } = await registerService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456', user.password_hash
        )

        expect(isPasswordCorrectlyHashed).toBe(true)


    })

    it('should not be able to register with same email twice', async () => {
        const userRepository = new InMemmoryUsersRepository()
        const registerService = new RegisterService(userRepository)

        const email = 'johndoe@example.com'


        await registerService.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })


        expect(() => 
            registerService.execute({
                name: 'John Doe',
                email,
                password: '123456',
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)


    })
})