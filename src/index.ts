import { ConsoleLogger } from "./cross-cutting";
import { MaitreD, MaitreDLogDecorator, MaitreDWithTsDecorator, Reservation } from "./maitreD";
import { ReservationRepository } from "./repository";

// Composition Root
// Pure DI

const capacity = 10;
const reservationRepo = new ReservationRepository();
const logger = new ConsoleLogger();

const reservation: Reservation = {
    id: 1,
    Date: "12/12/2022",
    Quantity: 3
};

// V1 — no logging
const maitreDV1 = new MaitreD(capacity, reservationRepo);
console.log("-----------Version 1-----------");
console.log(maitreDV1.canReserve(reservation));

// V3 — class-based Decorator, logger fully injectable
const maitreDV3 = new MaitreDLogDecorator(
    new MaitreD(capacity, reservationRepo),
    logger
);
console.log("-------------Version 3----------");
console.log(maitreDV3.canReserve(reservation));

// V4 — TypeScript decorator, logger bound at definition time
const maitreDV4 = new MaitreDWithTsDecorator(capacity, reservationRepo);
console.log("-------------Version 4----------");
console.log(maitreDV4.canReserve(reservation));
