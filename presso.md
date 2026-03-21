---
title: Thoughts on Unit Testing
author: Vishnu Ganesan
date: "2026-03-21"
theme:
  override:
    default:
      font_size: 2
    slide_title:
      colors:
        foreground: "00cc00"
    block_quote:
      prefix: "     "
      colors:
        foreground: "e6e6e6"
        background: "040312"
    code:
      background: false
      alignment: left
      margin:
        fixed: 13
    bold:
      colors:
        foreground: "00cc00"
    footer:
      style: template
      left: "{date}"
      right: "{current_slide} / {total_slides}"
---

Agenda
---

- Concepts
- The Restaurant Scenario
- Testing Pyramid
- The Ice Cream Cone Anti-Pattern
- Clean Architecture & Testing
- Sociable vs Solitary Tests
- Stubs vs Mocks
- Characteristics of a good Unit Test
- Test Smells
- From Smell to Solution: V1 → V3
- Bibliography

<!-- end_slide -->

Concepts
---

- **Dependency Injection**

> _When you go and get things out of the refrigerator for yourself, you can cause problems. You might leave the door open, you might get something Mommy or Daddy doesn't want you to have. You might even be looking for something we don't even have or which has expired. What you should be doing is stating a need, "I need something to drink with lunch," and then we will make sure you have something when you sit down to eat._

<!-- pause -->

- **Pure DI**

> _Pure DI is Dependency Injection without a DI Container_

<!-- pause -->

- **Composition Root**

> _A Composition Root is a (preferably) unique location in an application where modules are composed together._

<!-- pause -->

- **Constructor Over-Injection**

```typescript
constructor(
  capacity: number,
  reservationRepo: IReservationRepository,
  logger: ILogger,
  authorizationManager: IAuthorizationManager,
  cache: ICache,
)
```

<!-- pause -->

- **Pure Functions**

> _Simply, a pure function is a function that is deterministic and does not produce side effects._

```typescript
// Takes everything it needs as arguments — no dependencies, no mocks needed
export function canAccommodate(
    reserved: number,
    quantity: number,
    capacity: number
): boolean {
    return reserved + quantity <= capacity;
}
```

<!-- pause -->

- **Unit Test**

> _A unit test is a piece of a code (usually a method) that invokes another piece of code and checks the correctness of some assumptions afterward. If the assumptions turn out to be wrong, the unit test has failed. A unit is a method or function._

<!-- pause -->

- **State based testing**

> _State-based testing (also called state verification) determines whether the exercised method worked correctly by examining the changed behavior of the system under test and its collaborators (dependencies) after the method is exercised. It checks for noticeable behavior changes in the system under test, after changing its state._

<!-- pause -->

- **Value based testing**

> _Value-based testing checks the value returned from a function._

<!-- pause -->

- **Interaction testing**

> _Interaction testing is testing how an object sends messages (calls methods) to other objects. You use interaction testing when calling another object is the end result of a specific unit of work._

<!-- end_slide -->

The Restaurant Scenario
---

> _All code examples in this talk are built around a restaurant reservation system. Here's the domain._

<!-- pause -->

- **The Maître D'** (`MaitreD`)

> _The Maître D' is responsible for deciding whether a reservation can be accepted. If the number of already-booked seats plus the requested quantity does not exceed the restaurant's capacity, the reservation is allowed._

<!-- pause -->

- **The Reservation** (`Reservation`)

> _A reservation has an id, a date, and a quantity (number of seats requested)._

<!-- pause -->

- **The Repository** (`IReservationRepository`)

> _The repository is an external dependency — it fetches how many seats are already booked for a given date. In production this would be a database call. In tests, we replace it with a stub._

<!-- pause -->

```
                    ┌───────────────────────────┐
  canReserve()      │          MaitreD          │
 ────────────────▶  │                           │
                    │  reserved + quantity      │──▶ IReservationRepository
  true / false      │       <= capacity ?       │       getReservationQuantity()
 ◀────────────────  │                           │
                    └───────────────────────────┘
```

<!-- end_slide -->

Testing Pyramid
---

- **Unit Tests**

> _Test a single unit of code (a function or method) in isolation. They are fast, cheap to run, and should make up the bulk of your test suite._

<!-- pause -->

- **Integration Tests**

> _Test how multiple units work together — e.g. a service talking to a real database or an external dependency. Slower and more expensive than unit tests, but verify that the pieces connect correctly._

<!-- pause -->

- **End-to-End Tests (E2E)**

> _Test the entire application from the outside, simulating real user interactions. They are the slowest and most brittle, so keep them few and focused on critical paths._

<!-- pause -->

```
              /\
             /  \          <- E2E
            /────\            slow · few · brittle
           /      \
          /        \       <- Integration
         /──────────\         moderate · some
        /            \
       /              \    <- Unit Tests
      /────────────────\      fast · isolated · many
```

<!-- end_slide -->

The Ice Cream Cone Anti-Pattern
---

> _The Ice Cream Cone is the inverted testing pyramid — a test suite dominated by slow, expensive E2E and manual tests, with almost no unit tests at the base. It is the opposite of what you want._

<!-- pause -->

```
      /────────────────\      manual · slow · expensive
     /                  \
    /    E2E Tests        \   brittle · hard to debug
   /──────────────────────\
  /                        \
 /     Integration Tests    \  moderate · some coupling
/────────────────────────────\
            /    \               <- Unit Tests
           /──────\                 few · undertested
```

<!-- pause -->

- **Why it happens**

> _Teams reach for E2E tests because they feel safer and more "real". Unit tests get skipped under time pressure. Manual testing fills the gaps. Over time the suite becomes slow, fragile, and expensive to maintain._

<!-- pause -->

- **Why it's bad**

> _A single E2E test can take seconds or minutes to run. When it fails, you have no idea which layer broke. Slow feedback loops kill developer productivity and discourage running tests at all — making things worse over time._

<!-- pause -->

- **How to fix it**

> _Push coverage down the pyramid. Replace E2E tests that cover logic with unit tests. Use integration tests only for wiring. Reserve E2E for a small set of critical user journeys._

<!-- end_slide -->

Clean Architecture & Testing
---

- **The Dependency Rule**

> _Source code dependencies can only point inwards. Inner layers know nothing about outer layers. This makes the inner core independently testable — no framework, no database, no web server required._

<!-- pause -->

- **The Four Layers**

> _**Entities** — enterprise-wide business rules. The most stable layer, unaffected by any external change._
> _**Use Cases** — application-specific logic that orchestrates entities. Changes only when business requirements change._
> _**Interface Adapters** — convert data between the format convenient for use cases and the format needed by external systems (MVC controllers, presenters, repository implementations)._
> _**Frameworks & Drivers** — the outermost layer: databases, web frameworks, UI. All the details live here._

<!-- pause -->

![](CleanArchitecture.jpg)

<!-- pause -->

- **Driving vs Driven Adapters**

> _Driving adapters (controllers, CLI) call into the application through a port. Driven adapters (repositories, queues, email) are called by the application through a port. Ports are interfaces — natural seams for stubs and mocks._

<!-- pause -->

- **Crossing boundaries safely**

> _The Dependency Inversion Principle lets you cross boundaries without violating the dependency rule. Inner layers define interfaces (ports); outer layers implement them. Flow of control can go outward, but source code dependencies always point inward._

<!-- pause -->

- **Why it makes testing easier**

> _The inner core has zero external dependencies — unit test it directly, no mocks needed. Driven adapters sit behind interfaces — stub them in unit tests, or use the real implementation in integration tests. E2E tests only need to exercise the critical path from a driving adapter all the way through._

<!-- end_slide -->

Sociable vs Solitary Tests
---

- **Sociable Tests**

> _A sociable test exercises the system under test along with its real collaborators. It tests a unit of behaviour that may span multiple objects._

<!-- pause -->

- **Solitary Tests**

> _A solitary test replaces all collaborators of the system under test with test doubles (stubs or mocks), ensuring the test is fully isolated from external state or behaviour._

<!-- pause -->

```
        ┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐
          Sociable Tests
        └ ─ ─ ─ ─ ─ ─ ─ ─ ┘           .─.
                              ┌──────▶███)
                              │       `─'
┌────┐              .─.       │
│████│─────────────▶███)──────┤
└────┘              `─'       │
┌ ─ ─              ┌ ─ ┐      │       .─.
 Test│              SUT       └─────▶(███)
└ ─ ─              └ ─ ┘              `─'



                                      .─.          .─.
                              ┌──────▶   )        (███)
                              │       `─'          `─'
┌────┐              .─.       │
│████│─────────────▶███)──────┤
└────┘              `─'       │
┌ ─ ─              ┌ ─ ┐      │       .─.          .─.
 Test│              SUT       └─────▶(   )        (███)
└ ─ ─              └ ─ ┘              `─'          `─'

        ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─
           Solitary Tests  │
        └ ─ ─ ─ ─ ─ ─ ─ ─ ─
```

<!-- pause -->

- **Sociable test example** — `MaitreDLogDecorator` uses a real `MaitreD` and a real `ReservationRepository`. Only the `ILogger` is a mock, because _that_ is what the test is asserting on.

```typescript
test("CanReserve invokes logger with message", () => {
    // Arrange — real collaborators, only logger is a mock
    const reservationRepo = new ReservationRepository();
    const maitreD = new MaitreD(10, reservationRepo);
    const mockLogger = mock<ILogger>();
    const sut = new MaitreDLogDecorator(maitreD, mockLogger);

    // Act
    sut.canReserve({ id: 1, Date: "12/12/2022", Quantity: 3 });

    // Assert
    expect(mockLogger.Log).toHaveBeenCalledWith(
        "Checking if the reservation can be made"
    );
});
```

<!-- end_slide -->

Stubs vs Mocks
---

- **Fakes**

> _A fake is a generic term that can be used to describe either a stub or a mock object (handwritten or otherwise), because they both look like the real object. Whether a fake is a stub or a mock depends on how it’s used in the current test. If it’s used to check an interaction (asserted against), it’s a mock object. Otherwise, it’s a stub._

<!-- pause -->

- **Stubs**

> _A stub is a controllable replacement for an existing dependency (or collaborator) in the system. By using a stub, you can test your code without dealing with the dependency directly._

<!-- pause -->

- **Mocks**

> _A mock object is a fake object in the system that decides whether the unit test has passed or failed. It does so by verifying whether the object under test called the fake object as expected. There’s usually no more than one mock per test._

<!-- pause -->

```
    ┏━━━━━━━━━━━━┓                  ┏━━━━━━━━━━━━━┓
    ┃     SUT    ┃◀────────────────▶┃    STUB     ┃
    ┗━━━━━━━━━━━━┛   ┏ ━ ━ ━ ━ ━ ┓  ┗━━━━━━━━━━━━━┛
           ▲          Communicate
           │         ┗ ━ ━ ━ ━ ━ ┛
┏ ━ ━ ━ ━  │
  Assert ┃ │
┗ ━ ━ ━ ━  │
           │
           ▼
    ┏━━━━━━━━━━━━━┓
    ┃    TEST     ┃
    ┗━━━━━━━━━━━━━┛



    ┏━━━━━━━━━━━━┓                  ┏━━━━━━━━━━━━━┓
    ┃     SUT    ┃◀────────────────▶┃    MOCK     ┃
    ┗━━━━━━━━━━━━┛  ┏ ━ ━ ━ ━ ━ ┓   ┗━━━━━━━━━━━━━┛
                     Communicate           ▲
                    ┗ ━ ━ ━ ━ ━ ┛          │
                                           │┏ ━ ━ ━ ━
                                           │  Assert ┃
                                           │┗ ━ ━ ━ ━
                                           │
                                           ▼
                                    ┏━━━━━━━━━━━━━┓
                                    ┃    TEST     ┃
                                    ┗━━━━━━━━━━━━━┛
```

<!-- end_slide -->

Characteristics of a good Unit Test
---

- It should be automated and repeatable
- It should be easy to implement
- It should run quickly and be consistent in its results
- It should have full control of the unit under test
- It should be fully isolated.
- Avoid Setup and TearDown methods as much as you can.
- Avoid following DRY principle in unit tests — each test should be readable and self-contained in isolation; duplication in tests aids clarity over conciseness.
- A test should only fail for one reason.

<!-- end_slide -->

Test Smells
---

- **Brittle Tests**

> _A brittle test breaks when implementation details change, even if the observable behaviour hasn't. This usually means the test is coupled to how the code works rather than what it does._

<!-- pause -->

- **Testing structure vs behaviour**

> _Testing structure means asserting on internal implementation details (method calls, private state). Testing behaviour means asserting on observable outcomes. Prefer behaviour — it survives refactoring._

<!-- pause -->

- **Mock over-use**

> _Reaching for a mock when a stub would do leads to tests that are tightly coupled to call sequences. If you're not asserting on an interaction, use a stub._

<!-- pause -->

- **How to deodorize test smells**

> _Prefer value-based and state-based assertions over interaction testing. Introduce a Facade or Aggregate Service to reduce Constructor Over-Injection. Delete tests that duplicate coverage without adding signal._

<!-- end_slide -->

From Smell to Solution: V1 → V3
---

> _Our `MaitreD` went through three versions. Each version illustrates a concept from this talk._

<!-- pause -->

- **V1 — Pure function extracted, clean testable core**

```typescript
export class MaitreD implements IMaitreD {
    constructor(
        private capacity: number,
        private reservationRepo: IReservationRepository
    ) {}

    canReserve(reservation: Reservation): boolean {
        const reserved = this.reservationRepo
            .getReservationQuantity(reservation.Date);
        return canAccommodate(reserved, reservation.Quantity, this.capacity);
    }
}
```

<!-- pause -->

- **V2 — Constructor Over-Injection smell introduced**

```typescript
export class MaitreDV2 implements IMaitreD {
    constructor(
        private capacity: number,
        private reservationRepo: IReservationRepository,
        private logger: ILogger  // ← cross-cutting concern crept in
    ) {}

    canReserve(reservation: Reservation): boolean {
        this.logger.Log("Checking if the reservation can be made");
        const reserved = this.reservationRepo
            .getReservationQuantity(reservation.Date);
        return canAccommodate(reserved, reservation.Quantity, this.capacity);
    }
}
```

<!-- pause -->

- **V3 — Decorator pattern removes the smell**

```typescript
export class MaitreDLogDecorator implements IMaitreD {
    constructor(
        private maitreD: IMaitreD,  // wraps any IMaitreD
        private logger: ILogger
    ) {}

    canReserve(reservation: Reservation): boolean {
        this.logger.Log("Checking if the reservation can be made");
        return this.maitreD.canReserve(reservation); // delegates
    }
}
```

<!-- pause -->

- **The wiring — Composition Root**

```typescript
// V1 — no logging
const maitreDV1 = new MaitreD(10, new ReservationRepository());

// V3 — logging added without touching MaitreD
const maitreDV3 = new MaitreDLogDecorator(
    new MaitreD(10, new ReservationRepository()),
    new ConsoleLogger()
);
```

<!-- end_slide -->

Bibliography
---

- [The Art of Unit Testing 2nd Ed, Roy Osherove](https://www.manning.com/books/the-art-of-unit-testing-second-edition)
- [Unit testing, Martin Fowler](https://martinfowler.com/bliki/UnitTest.html)
