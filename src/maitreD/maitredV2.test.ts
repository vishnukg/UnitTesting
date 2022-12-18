import { test, assert } from "vitest";
import { mock } from "vitest-mock-extended";
import { IReservationRepository } from "../repository/IReservationRepository";
import { Reservation } from "../reservation";
import { MaitreDV2 } from "./maitredV2";

test("CanReserve returns true when there's capacity available", () => {
  const capacity = 10;
  const bookedSeats = 3;
  const stubRepository = mock<IReservationRepository>();
  stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
  const reservation: Reservation = {
    id: 1,
    Date: "12/12/2022",
    Quantity: 3,
  };
  const maiterd = new MaitreDV2(capacity, stubRepository);

  const result = maiterd.CanReserve(reservation);

  assert.equal(result, true);
});

test("CanReserve returns false when there's no capacity available", () => {
  const capacity = 10;
  const bookedSeats = 10;
  const stubRepository = mock<IReservationRepository>();
  stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
  const reservation: Reservation = {
    id: 1,
    Date: "12/12/2022",
    Quantity: 3,
  };
  const maiterd = new MaitreDV2(capacity, stubRepository);

  const result = maiterd.CanReserve(reservation);

  assert.equal(result, false);
});

test("Get Total Capacity returns total capacity", () => {
  const capacity = 10;
  const stubRepository = mock<IReservationRepository>();
  const maiterd = new MaitreDV2(capacity, stubRepository);

  const result = maiterd.getTotalCapacity();

  assert.equal(result, capacity);
});