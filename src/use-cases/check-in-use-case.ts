import { CheckIn } from '@prisma/client';
import { GymsRepository } from './../repositories/gyms-repository';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CheckInUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(private checkInsRespository: CheckInsRepository, private gymsRespository: GymsRepository) { }

    async execute({ userId, gymId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

        const gym = await this.gymsRespository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const checkInOnSameDay = await this.checkInsRespository.findByUserIdOnDate(
            userId,
            new Date()
        )

        if (checkInOnSameDay) {
            throw new Error()
        }

        const checkIn = await this.checkInsRespository.create({
            gym_id: gymId,
            user_id: userId
        })


        return {
            checkIn,
        }

    }
}