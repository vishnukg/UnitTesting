import { IMaitreD, Reservation } from ".";
import { ICache, ILogger } from "../cross-cutting";
import { IReservationRepository } from "../repository";
import { canAccommodate } from "./canAccommodate";

export class MaitreDV2 implements IMaitreD {
    constructor(
        private capacity: number,
        private reservationRepo: IReservationRepository,
        private logger: ILogger,
        private cache: ICache
    ) {}

    getTotalCapacity(): number {
        return this.capacity;
    }

    canReserve(reservation: Reservation): boolean {
        this.logger.Log("Checking if the reservation can be made");

        const cacheKey = `reserved:${reservation.Date}`;
        let reserved = this.cache.get<number>(cacheKey);
        if (reserved === undefined) {
            reserved = this.reservationRepo.getReservationQuantity(
                reservation.Date
            );
            this.cache.set(cacheKey, reserved);
        }

        return canAccommodate(reserved, reservation.Quantity, this.capacity);
    }
}
