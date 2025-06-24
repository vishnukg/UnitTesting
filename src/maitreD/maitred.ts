import { IMaitreD, Reservation } from ".";
import { IReservationRepository } from "../repository";

export class MaitreD implements IMaitreD {
    private capacity: number;
    private reservationRepo: IReservationRepository;
    constructor(capacity: number, reservationRepo: IReservationRepository) {
        this.capacity = capacity;
        this.reservationRepo = reservationRepo;
    }

    getTotalCapacity(): number {
        return this.capacity;
    }

    canReserve(reservation: Reservation): boolean {
        const reservedSeats = this.reservationRepo.getReservationQuantity(
            reservation.Date
        );

        if (reservedSeats + reservation.Quantity <= this.capacity) {
            return true;
        }
        return false;
    }
}
