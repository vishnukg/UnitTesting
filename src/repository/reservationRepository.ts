import { IReservationRepository } from "./IReservationRepository";

export class ReservationRepository implements IReservationRepository {
    // Sample repo returns a fixed value.
    // In real life this can be reading the value from dynamo or sql
    getReservationQuantity(Date: string): number {
        console.log(`Getting reseravation details from ${Date}`);
        return 3;
    }
}
