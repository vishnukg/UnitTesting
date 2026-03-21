import { ConsoleLogger } from "../cross-cutting";
import { Log } from "../cross-cutting/logDecorator";
import { IMaitreD, Reservation } from ".";
import { IReservationRepository } from "../repository";
import { canAccommodate } from "./canAccommodate";

// The logger is bound at class definition time, not construction time.
// This means the constructor only needs domain deps — no ILogger parameter.
// Trade-off: the logger is harder to swap out in tests.
const logger = new ConsoleLogger();

export class MaitreDWithTsDecorator implements IMaitreD {
    constructor(
        private capacity: number,
        private reservationRepo: IReservationRepository
    ) {}

    getTotalCapacity(): number {
        return this.capacity;
    }

    @Log(logger, "Checking if the reservation can be made")
    canReserve(reservation: Reservation): boolean {
        const reserved = this.reservationRepo.getReservationQuantity(
            reservation.Date
        );
        return canAccommodate(reserved, reservation.Quantity, this.capacity);
    }
}
