import { IReservationRepository } from "../repository";

// Aggregate Service — groups related domain dependencies into a single object.
// MaitreD only needs to know about "reservation context", not each individual dep.
export interface IMaitreDContext {
    capacity: number;
    reservationRepo: IReservationRepository;
}
