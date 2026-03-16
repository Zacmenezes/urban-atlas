# Copilot Instructions

## General Principles

* Prefer modifying existing files instead of creating new ones.
* Do not generate additional documentation files unless explicitly requested.
* Avoid creating files such as:

  * DELIVERY_REPORT.md
  * QUICK_START.md
  * IMPLEMENTATION_CHECKLIST.md
  * SUMMARY.md
  * CHANGELOG drafts
* Documentation should be added to existing files like `README.md` or inline code comments.

## File Creation Policy

Only create a new file if:

1. The user explicitly asks for it.
2. The file is required for the code to run (e.g., source code, configuration files).
3. The file is a test file related to the implemented feature.

Never create extra markdown documentation files by default.

## Code Style

* Prefer clear, maintainable, and minimal solutions.
* Avoid unnecessary abstractions.
* Avoid generating boilerplate code that is not used.

## Documentation

* Prefer inline documentation inside the code.
* Keep comments concise and useful.
* Do not generate long textual reports about the implementation.

## Project Structure

* Follow the existing project structure.
* Do not introduce new directories unless necessary.
* Reuse existing modules and services when possible.

## Dependency Management

* Do not introduce new dependencies unless necessary.
* Prefer standard libraries or existing project dependencies.

## Implementation Approach

When implementing features:

1. First analyze the existing codebase.
2. Reuse existing classes, services, or utilities.
3. Minimize the number of files modified or created.

## Output Style

* Provide direct code implementations.
* Avoid generating explanatory reports.
* Keep responses concise and focused on implementation.
