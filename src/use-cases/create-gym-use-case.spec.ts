import { expect, describe, it, beforeEach } from 'vitest'

import { CreateGymUseCase } from './create-gym-use-case';
import { InMemmoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRespository: InMemmoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {

    beforeEach(() => {
        gymsRespository = new InMemmoryGymsRepository()
        sut = new CreateGymUseCase(gymsRespository)
    })

    it('should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: 'Javascript Gym',
            description: null,
            phone: null,
            latitude: -15.8429902,
            longitude: -48.1101308
        })

        expect(gym.id).toEqual(expect.any(String))

    })
})