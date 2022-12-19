import { test, assert } from "vitest";
import { mock } from "vitest-mock-extended";
import { MaitreD, Reservation } from ".";
import { IReservationRepository } from "../repository";

test("CanReserve returns true when there's capacity available", () => {
  //Arrange
  const capacity = 10;
  const bookedSeats = 3;
  const stubRepository = mock<IReservationRepository>();
  stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
  const reservation: Reservation = {
    id: 1,
    Date: "12/12/2022",
    Quantity: 3,
  };
  const sut = new MaitreD(capacity, stubRepository);

  //Act
  const result = sut.canReserve(reservation);

  //Assert
  assert.equal(result, true);
});

test("CanReserve returns false when there's no capacity available", () => {
  //Arrange
  const capacity = 10;
  const bookedSeats = 10;
  const stubRepository = mock<IReservationRepository>();
  stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
  const reservation: Reservation = {
    id: 1,
    Date: "12/12/2022",
    Quantity: 3,
  };
  const sut = new MaitreD(capacity, stubRepository);

  //Act
  const result = sut.canReserve(reservation);

  //Assert
  assert.equal(result, false);
});

test("Get Total Capacity returns total capacity", () => {
  //Arrange
  const capacity = 10;
  const stubRepository = mock<IReservationRepository>();
  const maiterd = new MaitreD(capacity, stubRepository);

  //Act
  const sut = maiterd.getTotalCapacity();

  //Assert
  assert.equal(sut, capacity);
});
