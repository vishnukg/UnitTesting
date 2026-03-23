import { IMaitreD, Reservation } from ".";
import { ICache } from "../cross-cutting";

export class MaitreDCacheDecorator implements IMaitreD {
    constructor(private maitreD: IMaitreD, private cache: ICache) {}

    getTotalCapacity(): number {
        return this.maitreD.getTotalCapacity();
    }

    canReserve(reservation: Reservation): boolean {
        const cacheKey = `reserved:${reservation.Date}`;
        const cached = this.cache.get<boolean>(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        const result = this.maitreD.canReserve(reservation);
        this.cache.set(cacheKey, result);
        return result;
    }
}
