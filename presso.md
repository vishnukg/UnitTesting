# Thoughts on Unit Testing

A presentation by Vishnu Ganesan

---

## Agenda

- Definitions
- Kinds of Unit Tests
- Test Smells
- Conclusion

---

## Definitions

- **Dependency Injection**<br>
  <br>

  _When you go and get things out of the refrigerator for yourself, you can cause problems. You might leave the door open, you might get something Mommy or Daddy doesn't want you to have. You might even be looking for something we don't even have or which has expired. What you should be doing is stating a need, "I need something to drink with lunch," and then we will make sure you have something when you sit down to eat._

  <br>
  <br>

- **Pure DI**<br>
  <br>

  _Pure DI is Dependency Injection without a DI Container_

  <br>
  <br>

- **Composition Root**<br>
  <br>

  _A Composition Root is a (preferably) unique location in an application where modules are composed together._

  <br>
  <br>

- **Constructor Over-Injection**<br>
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

- **Pure Functions** <br>

  <br>

- **Impure Functions** <br>

  <br>

- **Unit Test** <br>
  <br>

  _A unit test is a piece of a code (usually a method) that invokes another piece of code and checks the correctness of some assumptions after- ward. If the assumptions turn out to be wrong, the unit test has failed. A unit is a method or function._
  <br>
  <br>

- **Stubs** <br>
  <br>

  _A stub is a controllable replacement for an existing dependency (or collaborator) in the system. By using a stub, you can test your code without dealing with the dependency directly._

  <br>
  <br>

- **Mocks** <br>

  <br>

---

## Kinds of Unit Test

- State Based
- Value Based
- Interaction Testing

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

## Characterstics of a good Unit Test

- It should be automated and repeatable
- It should be easy to implement
- It should run quickly and be consistent in its results
- It should have full control of the unit under test
- It should be fully isolated.
- Avoid Setup and TearDown methods as much as you can.
- A test should only fail for one reason.

---

## Test Smells

- Constructor Over-injection is a code smell, not an anti-pattern.
- Brittle Tests
- Testing the structure of the code vs behaviour
- Stubs vs Mocks
- How to deodorize the test smell ?

---

## Conclusion

```

```
