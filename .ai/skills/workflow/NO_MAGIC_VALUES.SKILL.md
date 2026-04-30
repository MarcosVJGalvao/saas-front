# Skill: No Magic Values (Clean Code)

## Goal

Prevent hidden meaning in code by avoiding magic strings and magic numbers.

## Rules

- Replace branch/control literals with named constants.
- Replace repeated UI/behavior literals with semantic constants.
- Keep constants near usage when local; promote to shared module when reused.
- Prefer enums/union-like constant objects for domain states and modes.

## Where to Place Constants

- Domain constants: `src/models` or module-level constants file.
- UI tokens: `src/theme`.
- Feature-local constants: top of feature file/module.

## Examples

- Bad: `if (status === 'APPROVED') { ... }`
- Good: `if (status === ORDER_STATUS.APPROVED) { ... }`

- Bad: `setTimeout(fetchData, 7000)`
- Good: `setTimeout(fetchData, REQUEST_RETRY_DELAY_MS)`

## Exceptions

- Small obvious control values in loops.
- Required protocol literals when abstraction would reduce clarity.
