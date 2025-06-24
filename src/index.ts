import { ConsoleLogger } from "./cross-cutting";
import { MaitreDLogDecorator, Reservation } from "./maitreD";
import { MaitreD } from "./maitreD/maitred";
import { MaitreDV2 } from "./maitreD/maitredV2";
import { ReservationRepository } from "./repository";

// Composition Root
//
// Pure DI
//
const capacity = 10;
const reservationRepository = new ReservationRepository();
const reservation: Reservation = {
    id: 1,
    Date: "12/12/2022",
    Quantity: 3
};

// Version 1
const maitreD = new MaitreD(capacity, reservationRepository);
console.log("-----------Version 1-----------");
console.log(maitreD.getTotalCapacity());
console.log(maitreD.canReserve(reservation));

// Version 2
const consoleLogger = new ConsoleLogger();
const maitreDV2 = new MaitreDV2(capacity, reservationRepository, consoleLogger);
console.log("------------Version 2----------");
console.log(maitreDV2.getTotalCapacity());
console.log(maitreDV2.canReserve(reservation));

//Version 3 with logging decorator
const maitreDLogDecorator = new MaitreDLogDecorator(maitreD, consoleLogger);
console.log("-------------Version 3----------");
console.log(maitreDLogDecorator.getTotalCapacity());
console.log(maitreDLogDecorator.canReserve(reservation));
