import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { CheckInUseCase } from './check-in-use-case';
import { InMemmoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemmoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { Gym } from '@prisma/client';


let checkinsRepository: InMemmoryCheckInsRepository
let gymsRepository: InMemmoryGymsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
    beforeEach(() => {
        checkinsRepository = new InMemmoryCheckInsRepository()
        gymsRepository = new InMemmoryGymsRepository()
        sut = new CheckInUseCase(checkinsRepository, gymsRepository)

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'Javascript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-15.8429902),
            longitude: new Decimal(-48.1101308)
        })
        
        vi.useFakeTimers()
    })
    
    afterEach(() => {
        vi.useRealTimers()
    })
    
    
    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -15.8429902,
            userLongitude: -48.1101308
        })

        expect(checkIn.id).toEqual(expect.any(String))

    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2024, 10, 20, 10, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -15.8429902,
            userLongitude: -48.1101308

        })


        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -15.8429902,
            userLongitude: -48.1101308

        })).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in differente days', async () => {
        vi.setSystemTime(new Date(2024, 10, 20, 10, 0, 0))


        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -15.8429902,
            userLongitude: -48.1101308

        })

        vi.setSystemTime(new Date(2024, 10, 21, 11, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -15.8429902,
            userLongitude: -48.1101308
        })

        expect(checkIn.id).toEqual(expect.any(String))

    })

    it('should not be able to check in on distant gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Javascript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-15.820695),
            longitude: new Decimal(-47.9669652)
        })

        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -15.8429902,
            userLongitude: -48.1101308
        })).rejects.toBeInstanceOf(Error)

    })

})