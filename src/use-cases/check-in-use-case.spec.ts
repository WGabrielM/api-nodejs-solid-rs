import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest'

import { CheckInUseCase } from './check-in-use-case';
import { InMemmoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';

let checkinsRepository: InMemmoryCheckInsRepository
let sut: CheckInUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        checkinsRepository = new InMemmoryCheckInsRepository()
        sut = new CheckInUseCase(checkinsRepository)
    })

    it('should be able to authenticate', async () => {
        const { checkIn } = await sut.execute({
           gymId: 'gym-01',
           userId: 'user-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))

    })

})