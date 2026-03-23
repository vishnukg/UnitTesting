---
title: "Test Smell Driven Design"
sub_title: "Let your tests tell you how to improve your code"
author: Vishnu Ganesan
date: "2026-03-23"
theme:
  override:
    default:
      font_size: 0
    slide_title:
      colors:
        foreground: "00cc00"
    intro_slide:
      title:
        colors:
          foreground: "00cc00"
      subtitle:
        colors:
          foreground: "ffffff"
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

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

🎯 **The Why**
- What is a Unit Test?
- SUT — System Under Test
- Arrange-Act-Assert
- Types of Assertion
- Why Unit Tests?
- Refactoring — It's Not a Task

📚 **Foundations**
- Characteristics of a good Unit Test
- Test Pain as a Signal
- Concepts (1/2)
- Concepts (2/2)

🧪 **Writing Tests**
- The Restaurant Scenario
- Testing Pyramid
- The Ice Cream Cone Anti-Pattern
- Sociable vs Solitary Tests (1/3)
- Sociable vs Solitary Tests (2/3)
- Sociable vs Solitary Tests (3/3)
- Stubs vs Mocks (1/2)
- Stubs vs Mocks (2/2)

<!-- column: 1 -->

🚨 **When It Goes Wrong**
- Test Smells

🔧 **Solutions**
- Decorator Pattern (1/2)
- Decorator Pattern (2/2)
- The Clean Core and the Smell: V1 → V2
- From Smell to Solution: V3
- The Wiring — Composition Root
- Aggregate Service Pattern
- Clean Architecture & Testing (1/2)
- Clean Architecture & Testing (2/2)
- Summary
- Bibliography

<!-- reset_layout -->

<!-- end_slide -->

What is a Unit Test?
---

> _A unit test is a piece of code that invokes another piece of code and checks the correctness of some assumptions afterward. If the assumptions turn out to be wrong, the unit test has failed._

<!-- pause -->

- **A unit** is the smallest piece of code worth verifying in isolation
  - a function, a class method, a pure expression — anything with a clear input and a verifiable output
  - not a whole service, not a full flow — just one behaviour at a time

<!-- pause -->

- **Automated** — runs without human interaction, gives a pass/fail result every time

<!-- pause -->

- **Isolated** — tests one thing at a time; when it fails, you know exactly what broke

<!-- pause -->

- **Three types of assertion** — value, state, and interaction _(covered on the next slide)_

<!-- end_slide -->

SUT — System Under Test
---

- **SUT** stands for _System Under Test_ — the thing you are currently testing

<!-- pause -->

> _Naming it `sut` in your test makes it immediately clear what is being exercised — and what everything else (stubs, mocks, input data) is just there to support it._

<!-- pause -->

```typescript
const repository = createTestDouble<IRepository>();  // supporting (test double)
const logger     = createTestDouble<ILogger>();       // supporting (test double)

const sut = new OrderService(repository, logger); // ← this is what we're testing
```

> _We'll cover test doubles (stubs, mocks, fakes) in detail shortly._

<!-- pause -->

> _If you find yourself unsure what the `sut` is in a test, that's a smell — the test is probably doing too much._

<!-- end_slide -->

Arrange-Act-Assert
---

> _Every unit test should follow three phases:_

<!-- pause -->

- **Arrange** — set up the SUT, its dependencies, and any input data

- **Act** — call the single behaviour you are testing

- **Assert** — verify the outcome

<!-- pause -->

```typescript
test("add returns the sum of two numbers", () => {
    // Arrange
    const sut = new Calculator();

    // Act
    const result = sut.add(2, 3);

    // Assert
    assert.equal(result, 5);
});
```

<!-- pause -->

> _One test, one Act. If you're calling Act more than once, you're testing more than one thing._

<!-- end_slide -->

Types of Assertion
---

- **Value** — assert on what the function _returns_. No object, no state, just a return value.

```typescript
// Pure function — give it inputs, check the output. Nothing to fake.
const result = add(2, 3);
assert.equal(result, 5);
```

<!-- pause -->

- **State** — call a method that changes the object, then query it to see if the change happened.

```typescript
const sut = new Counter(0);
sut.click(); // changes internal state

const result = sut.getCount();
assert.equal(result, 1); // verify the new state
```

<!-- pause -->

- **Interaction** — assert that the SUT _called_ a collaborator in the expected way.

```typescript
const mockEmailService = mock<IEmailService>();
sut.placeOrder(order);

expect(mockEmailService.send).toHaveBeenCalledWith(order.customerEmail);
```

<!-- pause -->

> _**Refactoring Safety:** Prefer **value** over **state** over **interaction**. Interaction tests are the most brittle — they assert on HOW something works, not WHAT it does. They break when you refactor even if the behaviour is unchanged._

> 💻 **nvim** `src/statebased/counter.ts` · `src/statebased/counter.test.ts`

<!-- end_slide -->

Why Unit Tests?
---

- **Fast feedback loop**

> _Unit tests run in milliseconds. They catch regressions the moment you break something — not after a 10-minute build, not after a QA cycle._

<!-- pause -->

- **Confidence to refactor**

> _Without tests, changing code is guesswork. With a solid unit test suite, you can refactor aggressively and trust the tests to catch anything you break._

<!-- pause -->

- **Living documentation**

> _A well-named test describes exactly what the system does and under what conditions. It never goes stale — if it did, it would fail._

<!-- pause -->

- **Forces better design**

> _Code that is hard to test is usually hard to understand and maintain. Unit tests surface design problems early — tight coupling, too many responsibilities, hidden dependencies._

<!-- end_slide -->

Refactoring — It's Not a Task
---

> _Refactoring is changing the internal structure of code without changing its observable behaviour._

<!-- pause -->

- **It is not a story, ticket, or sprint item**

> _Refactoring is something you do continuously — every time you add a feature, fix a bug, or read code you don't fully understand. It is part of the job, not a separate phase._

<!-- pause -->

- **The Campsite Rule**

> _"Always leave the code better than you found it."_ — Robert C. Martin (Uncle Bob)
>
> _You don't have to refactor everything. Just leave whatever you touch a little cleaner: rename a confusing variable, extract a function, remove a dead comment. Small improvements compound over time._

<!-- pause -->

- **Tests are the safety net**

> _Without tests, refactoring is dangerous. You might clean up the code but silently break behaviour. A solid unit test suite means you can refactor aggressively and confidently — the tests will tell you immediately if something breaks._

<!-- pause -->

> _This is why **confidence to refactor** is one of the biggest returns on investment from unit testing._

<!-- end_slide -->

Characteristics of a good Unit Test
---

- **Fast & Reliable**

> _Runs in milliseconds, no external state, fully isolated. Results are consistent — run it 1000 times, get the same answer._

<!-- pause -->

- **Readable & Self-Contained**

> _Each test tells a complete story on its own. No shared setup that hides intent. Duplication is fine — clarity beats DRY in tests._

<!-- pause -->

- **Focused**

> _One concept per test. A failing test should point to exactly one thing. If a test can fail for multiple reasons, split it._

<!-- pause -->

- **Trustworthy**

> _A test that never fails is as useless as a test that always fails. Tests must be honest — green means working, red means broken._

<!-- pause -->

- **Hard to write? Listen to the test**

> _If a test is painful to set up, requires many mocks, or breaks on every refactor — that's not a test problem. That's your code telling you its design needs work._

<!-- pause -->

<!-- end_slide -->

Test Pain as a Signal
---

- **Not all test pain is equal — learn to tell them apart**

<!-- pause -->

- **Integration / E2E pain = environment pain**

> _Spinning up databases, containers, services. Slow feedback, flaky networks, seed data. The pain comes from outside the code._

<!-- pause -->

- **Unit test pain = design pain**

> _Hard to construct, too many mocks, breaks on every refactor. The pain comes from inside the code — tight coupling, too many responsibilities._

<!-- pause -->

- **Integration tests are slower to diagnose**

> _When they fail, you know something is broken somewhere across many layers, but not exactly where. Unit tests point to the exact unit that broke._

<!-- pause -->

> _**Integration tests are painful because of infrastructure. Unit tests are painful because of design. Only one of those is telling you to change your code.**_

<!-- end_slide -->

Concepts (1/2)
---

> _These concepts come up repeatedly in the talk. Treat this slide as a reference — we'll see them all in action in the demo section._

- **Dependency Injection**

> _When you go and get things out of the refrigerator for yourself, you can cause problems. You might leave the door open, you might get something Mommy or Daddy doesn't want you to have. You might even be looking for something we don't even have or which has expired. What you should be doing is stating a need, "I need something to drink with lunch," and then we will make sure you have something when you sit down to eat._

<!-- pause -->

- **Pure DI**

> _Pure DI is Dependency Injection without a DI Container — i.e. you wire dependencies manually in code rather than using a framework like InversifyJS or tsyringe to do it for you._

<!-- pause -->

- **Composition Root**

> _A Composition Root is a (preferably) unique location in an application where modules are composed together._

<!-- end_slide -->

Concepts (2/2)
---

- **Constructor Over-Injection**

```typescript
constructor(
  database: IDatabase,
  logger: ILogger,
  authorizationManager: IAuthorizationManager,
  cache: ICache,
  emailService: IEmailService
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

> 💻 **nvim** `src/maitreD/canAccommodate.ts` · `src/maitreD/canAccommodate.test.ts`

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

<!-- pause -->

> 💻 **nvim** `src/maitreD/maitred.ts` · `src/maitreD/reservation.ts` · `src/repository/IReservationRepository.ts`

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

Sociable vs Solitary Tests (1/3)
---

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

- **Sociable Tests**

> _A sociable test exercises the system under test along with its real collaborators. It tests a unit of behaviour that may span multiple objects._

<!-- column: 1 -->

- **Solitary Tests**

> _A solitary test replaces all collaborators of the system under test with test doubles (stubs or mocks), ensuring the test is fully isolated from external state or behaviour._

<!-- reset_layout -->

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

<!-- end_slide -->

Sociable vs Solitary Tests (2/3)
---

- **London School** _(Mockist)_ — aligns with **Solitary Tests**

> _Test each class in complete isolation. Mock all collaborators. Drive design top-down from the outside in. Favours interaction testing._

<!-- pause -->

- **Chicago / Detroit School** _(Classicist)_ — aligns with **Sociable Tests**

> _Test units of behaviour, not units of code. Use real collaborators where possible. Only mock at the system boundary (database, network, filesystem). Favours value and state testing._

<!-- pause -->

> _Neither school is universally right. Chicago gives you tests that survive refactoring. London gives you tests that expose design problems early. Use both — deliberately._

<!-- end_slide -->

Sociable vs Solitary Tests (3/3)
---

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

> 💻 **nvim** `src/maitreD/maitredlogdecorator.test.ts`

<!-- end_slide -->

Stubs vs Mocks (1/2)
---

- **Fakes**

> _A working but simplified implementation — e.g. an in-memory database instead of a real one. The distinction between stub and mock depends on how it's used in the test._

<!-- pause -->

- **Stubs** — _Indirect Inputs_

> _A controllable replacement that returns preset values. Use these for **data retrieval** (e.g. querying a DB or API). You never assert on a stub._

<!-- pause -->

- **Mocks** — _Indirect Outputs_

> _A fake that records interactions and decides whether the test passes or fails. Use these for **side-effects** (e.g. sending an email or logging). You assert on a mock. There's usually no more than one mock per test._

<!-- pause -->

- **Spies**

> _A spy wraps a real object and records calls to it without replacing its behaviour. Useful when you want to verify an interaction happened but still want the real implementation to run._

<!-- pause -->

> _**The rule:** asserting on it → **mock**. Feeding it data → **stub**. Full working implementation → **fake**. Wraps a real object → **spy**._

<!-- end_slide -->

Stubs vs Mocks (2/2)
---

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

> 💻 **nvim** `src/maitreD/maitred.test.ts` · `src/maitreD/maitredV2.test.ts`

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

> _Prefer value-based and state-based assertions over interaction testing. Introduce a Facade or Aggregate Service to reduce Constructor Over-Injection _(covered in the Aggregate Service Pattern slide)_. Delete tests that duplicate coverage without adding signal._

> 💻 **nvim** `src/maitreD/maitred.test.ts` · `src/maitreD/maitredV2.test.ts`

<!-- end_slide -->

Decorator Pattern (1/2)
---

> _The Decorator pattern attaches additional behaviour to an object by wrapping it inside another object that shares the same interface. The wrapper delegates to the real object for the core work, and adds its own behaviour around it._

<!-- pause -->

```
  <<interface>>
   IMaitreD
  ┌──────────────┐
  │ canReserve() │
  │ getCapacity()│
  └──────┬───────┘
         │ implements
         │
    ┌────┴────────────────────────────────────────────────────┐
    │                    │                                    │
    ▼                    ▼                                    ▼
┌──────────────┐ ┌───────────────────────────┐ ┌────────────────────────────┐
│   MaitreD    │ │   MaitreDLogDecorator     │ │   MaitreDCacheDecorator    │
│  (real impl) │ │                           │ │                            │
│              │ │  - delegates canReserve() │ │  - delegates canReserve()  │
└──────────────┘ │  - adds logging around it │ │  - adds caching around it  │
                 └───────────────────────────┘ └────────────────────────────┘
```

> 💻 **nvim** `src/maitreD/maitredlogdecorator.ts` · `src/maitreD/maitreDCacheDecorator.ts`

<!-- end_slide -->

Decorator Pattern (2/2)
---

- **Why it keeps things testable**

> _The real `MaitreD` stays free of cross-cutting concerns — unit test it with no noise. The decorator can be tested in isolation by wrapping a mock. Neither class knows about the other's internals._

<!-- pause -->

- **When NOT to use it**

> _When the behaviour is core domain logic, not a cross-cutting concern. If removing the decorator would break the business rule, it belongs inside the class, not outside it._

<!-- pause -->

- **The rule**

> _If you find yourself adding a new dependency to a constructor just to handle logging, caching, or authorisation — stop. That is a cross-cutting concern. Wrap it with a Decorator instead._

> 💻 **nvim** `src/maitreD/maitredlogdecorator.ts` · `src/maitreD/maitreDCacheDecorator.ts`

<!-- end_slide -->

The Clean Core and the Smell: V1 → V2
---

> _Our `MaitreD` went through four versions. Each version illustrates a concept from this talk._

<!-- pause -->

- **V1 — Only domain dependencies, no cross-cutting concerns**

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
        private logger: ILogger,  // ← cross-cutting concern crept in
        private cache: ICache     // ← and another one
    ) {}

    canReserve(reservation: Reservation): boolean {
        this.logger.Log("Checking if the reservation can be made");

        const cacheKey = `reserved:${reservation.Date}`;
        let reserved = this.cache.get<number>(cacheKey);
        if (reserved === undefined) {
            reserved = this.reservationRepo
                .getReservationQuantity(reservation.Date);
            this.cache.set(cacheKey, reserved);
        }

        return canAccommodate(reserved, reservation.Quantity, this.capacity);
    }
}
```

> 💻 **nvim** `src/maitreD/maitred.ts` · `src/maitreD/maitredV2.ts`

<!-- end_slide -->

From Smell to Solution: V3
---

- **V3 — Class-based Decorators remove the smell**

```typescript
export class MaitreDLogDecorator implements IMaitreD {
    constructor(
        private maitreD: IMaitreD,  // wraps any IMaitreD
        private logger: ILogger
    ) {}

    getTotalCapacity(): number {
        return this.maitreD.getTotalCapacity();
    }

    canReserve(reservation: Reservation): boolean {
        this.logger.Log("Checking if the reservation can be made");
        return this.maitreD.canReserve(reservation); // delegates
    }
}
```

<!-- pause -->

```typescript
export class MaitreDCacheDecorator implements IMaitreD {
    constructor(
        private maitreD: IMaitreD,  // wraps any IMaitreD
        private cache: ICache
    ) {}

    getTotalCapacity(): number {
        return this.maitreD.getTotalCapacity();
    }

    canReserve(reservation: Reservation): boolean {
        const cacheKey = `reserved:${reservation.Date}`;
        const cached = this.cache.get<boolean>(cacheKey);
        if (cached !== undefined) return cached;

        const result = this.maitreD.canReserve(reservation);
        this.cache.set(cacheKey, result);
        return result; // delegates + caches
    }
}
```

<!-- pause -->

- **Stack them at the Composition Root**

```typescript
const maitreDV3 = new MaitreDLogDecorator(
    new MaitreDCacheDecorator(
        new MaitreD(10, new ReservationRepository()),
        new MemoryCache()
    ),
    new ConsoleLogger()
);
```

> 💻 **nvim** `src/maitreD/maitredlogdecorator.ts` · `src/maitreD/maitreDCacheDecorator.ts`

<!-- end_slide -->

The Wiring — Composition Root
---

- **All versions side by side**

```typescript
// V1 — no logging
const maitreDV1 = new MaitreD(10, new ReservationRepository());

// V2 — Constructor Over-Injection smell (logger + cache in constructor)
const maitreDV2 = new MaitreDV2(
    10, new ReservationRepository(), new ConsoleLogger(), new MemoryCache()
);

// V3 — stacked Decorators, each concern wrapped independently
const maitreDV3 = new MaitreDLogDecorator(
    new MaitreDCacheDecorator(
        new MaitreD(10, new ReservationRepository()),
        new MemoryCache()
    ),
    new ConsoleLogger()
);
```

> 💻 **nvim** `src/maitreD/maitred.ts` · `src/maitreD/maitredV2.ts` · `src/maitreD/maitredlogdecorator.ts` · `src/maitreD/maitreDCacheDecorator.ts` · `src/index.ts`

<!-- end_slide -->

Aggregate Service Pattern (1/2)
---

> _The Aggregate Service (also called Facade) groups a set of related fine-grained dependencies into a single coarse-grained dependency. It gives the group a meaningful name that belongs to the domain._

<!-- pause -->

- **When to use it**

> _When a class has many constructor parameters that all belong to the same concept — not cross-cutting concerns, but domain-level dependencies that naturally go together._

<!-- pause -->

- **The problem** — domain deps keep growing

```typescript
constructor(
    capacity: number,
    reservationRepo: IReservationRepository,
    depositAmount: number,
    paymentProcessor: IPaymentProcessor
)
```

<!-- pause -->

- **Aggregate Service** — group domain deps into context objects

```typescript
interface IRestaurantContext {
    capacity: number;
    reservationRepo: IReservationRepository;
}

interface IPaymentContext {
    depositAmount: number;
    paymentProcessor: IPaymentProcessor;
}

export class MaitreDAggregate implements IMaitreD {
    constructor(
        private restaurantContext: IRestaurantContext,
        private paymentContext: IPaymentContext
    ) {}

    canReserve(reservation: Reservation): boolean {
        const reserved = this.restaurantContext.reservationRepo
            .getReservationQuantity(reservation.Date);
        if (!canAccommodate(reserved, reservation.Quantity,
            this.restaurantContext.capacity)) {
            return false;
        }
        return this.paymentContext.paymentProcessor
            .holdDeposit(reservation.id, this.paymentContext.depositAmount);
    }
}
```

<!-- end_slide -->

Aggregate Service Pattern (2/2)
---

- **Combined with Decorator** — cross-cutting concerns stay out too

```typescript
const maitreD = new MaitreDLogDecorator(
    new MaitreDAggregate(
        { capacity: 10, reservationRepo: new ReservationRepository() },
        { depositAmount: 50, paymentProcessor: new PaymentProcessor() }
    ),
    new ConsoleLogger()
);
```

<!-- pause -->

- **Why this helps testing**

> _Each context is a plain data structure — stub it with a single object literal in tests. The Aggregate class groups domain deps by concept (restaurant vs payment), keeping each one focused. The Decorator wraps on top without polluting either._

> 💻 **nvim** `src/maitreD/IMaitreDContext.ts` · `src/maitreD/IPaymentContext.ts` · `src/maitreD/maitreDAggregate.ts` · `src/maitreD/maitreDAggregate.test.ts`

<!-- end_slide -->

Clean Architecture & Testing (1/2)
---

- **The Dependency Rule**

> _Source code dependencies can only point inwards. Inner layers know nothing about outer layers. This makes the inner core independently testable — no framework, no database, no web server required._

<!-- pause -->

- **The Four Layers**

> _**Entities** — enterprise-wide business rules. (e.g. our `canAccommodate` pure function)._
> _**Use Cases** — application-specific logic that orchestrates entities. (e.g. our `MaitreD.canReserve`)._
> _**Interface Adapters** — convert data between layers. (e.g. our `IReservationRepository` interface/port)._
> _**Frameworks & Drivers** — external details. (e.g. the real SQL implementation of the repository)._

<!-- pause -->

![](CleanArchitecture.jpg)

<!-- end_slide -->

Clean Architecture & Testing (2/2)
---

- **Driving vs Driven Adapters**

> _Driving adapters (controllers, CLI) call into the application through a port. Driven adapters (repositories, queues, email) are called by the application through a port. Ports are interfaces — natural seams for stubs and mocks._

<!-- pause -->

- **Crossing boundaries safely**

> _The Dependency Inversion Principle lets you cross boundaries without violating the dependency rule. Inner layers define interfaces (ports); outer layers implement them. Flow of control can go outward, but source code dependencies always point inward._

<!-- pause -->

- **Why it makes testing easier**

> _The inner core has zero external dependencies — unit test it directly, no mocks needed. Driven adapters sit behind interfaces — stub them in unit tests, or use the real implementation in integration tests. E2E tests only need to exercise the critical path from a driving adapter all the way through._

> 💻 **nvim** `src/maitreD/canAccommodate.ts` · `src/maitreD/maitred.ts` · `src/repository/IReservationRepository.ts`

<!-- end_slide -->

Summary
---

> _Test smells are not just annoyances — they are signals. Every painful test is pointing at a design problem in your code._

<!-- pause -->

- **Refactor continuously, not occasionally** — leave the code better than you found it (Campsite Rule). Tests give you the safety net to do this without fear.

<!-- pause -->

- **Extract pure functions** — logic with no dependencies is trivially testable and never needs mocks

<!-- pause -->

- **Keep cross-cutting concerns out of constructors** — use the Decorator pattern to wrap behaviour without polluting your domain classes

<!-- pause -->

- **Group domain dependencies** — use the Aggregate Service pattern when constructor parameters grow, giving the group a meaningful name

<!-- pause -->

- **Wire it all together at the Composition Root** — one place, all dependencies explicit, nothing hidden

<!-- pause -->

> _When your tests are easy to write, fast to run, and clear to read — your architecture is doing its job._

<!-- end_slide -->

Bibliography
---

- [The Art of Unit Testing 2nd Ed, Roy Osherove](https://www.manning.com/books/the-art-of-unit-testing-second-edition)
- [Unit testing, Martin Fowler](https://martinfowler.com/bliki/UnitTest.html)
