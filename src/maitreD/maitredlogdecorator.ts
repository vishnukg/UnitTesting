import { IMaitreD, Reservation } from ".";
import { ILogger } from "../cross-cutting";

export class MaitreDLogDecorator implements IMaitreD {
    private maitreD: IMaitreD;
    private logger: ILogger;

    constructor(maitreD: IMaitreD, logger: ILogger) {
        this.maitreD = maitreD;
        this.logger = logger;
    }

    getTotalCapacity(): number {
        return this.maitreD.getTotalCapacity();
    }

    canReserve(reservation: Reservation): boolean {
        this.logger.Log("Using logging decorator");
        this.logger.Log("Checking if the reservation can be made");
        return this.maitreD.canReserve(reservation);
    }
}
