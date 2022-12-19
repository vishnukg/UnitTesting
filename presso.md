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

- **Dependency Injection**

_When you go and get things out of the refrigerator for yourself, you can cause problems. You might leave the door open, you might get something Mommy or Daddy doesn't want you to have. You might even be looking for something we don't even have or which has expired. What you should be doing is stating a need, "I need something to drink with lunch," and then we will make sure you have something when you sit down to eat._

- **Pure DI** \

  _Pure DI is Dependency Injection without a DI Container_

- **Composition Root**\

  _A Composition Root is a (preferably) unique location in an application where modules are composed together._

- **Constructor Over-Injection**\

  ```typescript
  constructor(
    capacity: number,
    reservationRepo: IReservationRepository,
    logger: ILogger,
    authorizationManager: IAuthorizationManager,
    cache: ICache,
    circuitBreaker: ICircuitBreaker
  )
  ```

- **Pure Functions**\

- **Impure Functions**\

- **Unit Test**\

---

## Kinds of Unit Test

- State Based
- Value Based
- Interaction Testing

---

## Characterstics of a good Unit Test

---

## Test Smells

- Constructor Over-injection is a code smell, not an anti-pattern.
- Brittle Tests
- Testing the structure of the code vs behaviour
- Stubs vs Mocks
- How to break the test smell ?

---

## Conclusion
