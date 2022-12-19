import { ILogger } from "../cross-cutting/logger";
import { IReservationRepository } from "../repository/IReservationRepository";
import { Reservation } from "../reservation";

export class MaitreDV3 {
  private capacity: number;
  private reservationRepo: IReservationRepository;
  private logger: ILogger;



  constructor(
    capacity: number,
    reservationRepo: IReservationRepository,
    logger: ILogger,
    authorizationManager: IAuthorizationManager,
    cache: ICache,
    CircuitBreaker: ICircuitBreaker
  ) {
    this.capacity = capacity;
    this.reservationRepo = reservationRepo;
	  this.logger = logger;
	  this.
  }

  getTotalCapacity(): number {
    return this.capacity;
  }

  CanReserve(reservation: Reservation): boolean {
    const reservedSeats = this.reservationRepo.getReservationQuantity(
      reservation.Date
    );

    this.logger.Log(reservedSeats.toString());

    if (reservedSeats + reservation.Quantity <= this.capacity) {
      return true;
    }
    return false;
  }
}
