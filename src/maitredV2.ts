import { Reservation } from "./reservation";
import { ReservationRepository } from "./ReservationRepository";

export class MaitreDV2 {
  private capacity: number;
  private reservationRepo: ReservationRepository;
  constructor(capacity: number, reservationRepo: ReservationRepository) {
    this.capacity = capacity;
    this.reservationRepo = reservationRepo;
  }

  getTotalCapacity(): number {
    return this.capacity;
  }

  CanReserve(reservation: Reservation): boolean {
    const reservedSeats = this.reservationRepo.getReservationQuantity(
      reservation.Date
    );

    if (reservedSeats + reservation.Quantity <= this.capacity) {
      return true;
    }
    return false;
  }
}
