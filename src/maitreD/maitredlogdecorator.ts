import { IMaitreD, Reservation } from ".";
import { ILogger } from "../cross-cutting";

export class MaitreDLogDecorator implements IMaitreD {
    constructor(private maitreD: IMaitreD, private logger: ILogger) {}

    getTotalCapacity(): number {
        return this.maitreD.getTotalCapacity();
    }

    canReserve(reservation: Reservation): boolean {
        this.logger.Log("Checking if the reservation can be made");
        return this.maitreD.canReserve(reservation);
    }
}
