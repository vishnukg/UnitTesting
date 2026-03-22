import { IMaitreD, Reservation } from ".";
import { IReservationRepository } from "../repository";
import { canAccommodate } from "./canAccommodate";

export class MaitreD implements IMaitreD {
    constructor(
        private capacity: number,
        private reservationRepo: IReservationRepository
    ) {}

    getTotalCapacity(): number {
        return this.capacity;
    }

    canReserve(reservation: Reservation): boolean {
        const reserved = this.reservationRepo.getReservationQuantity(
            reservation.Date
        );
        return canAccommodate(reserved, reservation.Quantity, this.capacity);
    }
}
