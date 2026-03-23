import { IReservationRepository } from "../repository";

// Aggregate Service — groups related reservation dependencies into a single object.
export interface IRestaurantContext {
    capacity: number;
    reservationRepo: IReservationRepository;
}
