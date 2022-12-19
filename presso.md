# Thoughts on Unit Testing

A presentation by Vishnu Ganesan

---

## Agenda

- Concepts
- Sociable vs Solitary Tests
- Stubs vs Mocks
- Test Smells
- Bibliography

---

## Concepts

- **Dependency Injection**
  <br>
  <br>

  _When you go and get things out of the refrigerator for yourself, you can cause problems. You might leave the door open, you might get something Mommy or Daddy doesn't want you to have. You might even be looking for something we don't even have or which has expired. What you should be doing is stating a need, "I need something to drink with lunch," and then we will make sure you have something when you sit down to eat._

  <br>
  <br>

- **Pure DI**
  <br>
  <br>

  _Pure DI is Dependency Injection without a DI Container_

<br>
<br>

- **Composition Root**
  <br>
  <br>

  _A Composition Root is a (preferably) unique location in an application where modules are composed together._

<br>
<br>

- **Constructor Over-Injection**
  <br>
  <br>

  ```typescript
  constructor(
    capacity: number,
    reservationRepo: IReservationRepository,
    logger: ILogger,
    authorizationManager: IAuthorizationManager,
    cache: ICache,
  )
  ```

  <br>
  <br>

- **Pure Functions**
  <br>
  <br>
  _Simply, a pure function is a function that is deterministic and does not produces side effects._
  <br>
  <br>

- **Unit Test**
  <br>
  <br>

  _A unit test is a piece of a code (usually a method) that invokes another piece of code and checks the correctness of some assumptions afterward. If the assumptions turn out to be wrong, the unit test has failed. A unit is a method or function._
  <br>
  <br>

- State based testing
  <br>
  <br>
  _State-based testing (also called state verification) determines whether the exercised method worked correctly by examining the changed behavior of the system under test and its collaborators (dependencies) after the method is exercised._

  _State-based testing is about checking for noticeable behavior changes in the system under test, after changing its state._
  <br>
  <br>

- Value based testing
  <br>
  <br>
  _Value-based testing checks the value returned from a function._
  <br>
  <br>

- Interaction testing
  <br>
  <br>

  _Interaction testing is testing how an object sends messages (calls methods) to other objects. You use interaction testing when calling another object is the end result of a specific unit of work._

  <br>
  <br>

---

## Sociable vs Solitary Tests

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

---

## Stubs vs Mocks

- **Fakes**
  <br>
  <br>

  _A fake is a generic term that can be used to describe either a stub or a mock object (handwritten or otherwise), because they both look like the real object. Whether a fake is a stub or a mock depends on how it’s used in the current test. If it’s used to check an interaction (asserted against), it’s a mock object. Otherwise, it’s a stub._

  <br>
  <br>

- **Stubs**
  <br>
  <br>

  _A stub is a controllable replacement for an existing dependency (or collaborator) in the system. By using a stub, you can test your code without dealing with the dependency directly._

  <br>
  <br>

- **Mocks**
  <br>
  <br>

  _A mock object is a fake object in the system that decides whether the unit test has passed or failed. It does so by verifying whether the object under test called the fake object as expected. There’s usually no more than one mock per test._

  <br>
  <br>

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

---

## Characteristics of a good Unit Test

- It should be automated and repeatable
- It should be easy to implement
- It should run quickly and be consistent in its results
- It should have full control of the unit under test
- It should be fully isolated.
- Avoid Setup and TearDown methods as much as you can.
- Avoid following DRY principle in unit tests
- A test should only fail for one reason.

---

## Test Smells

- Constructor Over-injection is a code smell, not an anti-pattern.
- Brittle Tests
- Testing the structure of the code vs behaviour
- Stubs vs Mocks
- How to deodorize the test smell ?

---

## Bibliography

- [The Art of Unit Testing 2nd Ed, Roy Osherove](https://www.manning.com/books/the-art-of-unit-testing-second-edition)
- [Unit testing, Martin Fowler](https://martinfowler.com/bliki/UnitTest.html)
