import { IMaitreD, Reservation } from ".";
import { ILogger } from "../cross-cutting";
import { IReservationRepository } from "../repository";
import { canAccommodate } from "./canAccommodate";

export class MaitreDV2 implements IMaitreD {
    constructor(
        private capacity: number,
        private reservationRepo: IReservationRepository,
        private logger: ILogger
    ) {}

    getTotalCapacity(): number {
        return this.capacity;
    }

    canReserve(reservation: Reservation): boolean {
        this.logger.Log("Checking if the reservation can be made");

        const reserved = this.reservationRepo.getReservationQuantity(
            reservation.Date
        );

        return canAccommodate(reserved, reservation.Quantity, this.capacity);
    }
}
