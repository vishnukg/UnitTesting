import { ConsoleLogger, MemoryCache } from "./cross-cutting";
import { MaitreD, MaitreDV2, MaitreDCacheDecorator, MaitreDLogDecorator, Reservation } from "./maitreD";
import { ReservationRepository } from "./repository";

// Composition Root
// Pure DI

const capacity = 10;
const reservationRepo = new ReservationRepository();
const logger = new ConsoleLogger();
const cache = new MemoryCache();

const reservation: Reservation = {
    id: 1,
    Date: "12/12/2022",
    Quantity: 3
};

// V1 — no logging
const maitreDV1 = new MaitreD(capacity, reservationRepo);
console.log("-----------Version 1-----------");
console.log(maitreDV1.canReserve(reservation));

// V2 — Constructor Over-Injection smell (logger + cache in constructor)
const maitreDV2 = new MaitreDV2(capacity, reservationRepo, logger, cache);
console.log("-----------Version 2-----------");
console.log(maitreDV2.canReserve(reservation));

// V3 — stacked Decorators, each concern wrapped independently
const maitreDV3 = new MaitreDLogDecorator(
    new MaitreDCacheDecorator(
        new MaitreD(capacity, reservationRepo),
        cache
    ),
    logger
);
console.log("-------------Version 3----------");
console.log(maitreDV3.canReserve(reservation));
