# Contributing to Swell

We love your input! We want to make contributing to Swell as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## We Develop with Github

We use Github to host code, to track issues and feature requests, as well as accept pull requests.

## All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to Swell. We actively welcome your pull requests:

1. Fork the repo and create your branch from `dev`.
2. If you've added code that should be tested, add tests (see testing details above "License" below).
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/briandk/transcriptase-atom/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/open-source-labs/Swell/issues); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can. Include sample code that _anyone_ can run to reproduce what you are experiencing
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People _love_ thorough bug reports. I'm not even kidding.

## Use a Consistent Coding Style

- 2 spaces for indentation rather than tabs
- You can try running `npm run lint` for style unification

## Test early, test often!

- Run npm run test or npm run test-mocha for E2E testing with [Playwright](https://playwright.dev/docs/api/class-electron) and Mocha
- Run npm run test-jest for unit and integration tests with Jest
- Check code coverage!
  - In the 'test/coverage' directory, check jest-coverage and mocha-coverage directories
    - View each index.html in your browser for coverage reports generated with Istanbul that will show covered and uncovered lines in accessed modules
  - Merge the coverage reports by running npm run report
    - View an overall coverage report at index.html in the total-coverage directory
- Contribute to the testing suite
  - Add tests for uncovered lines, modules, functions. Leave no stone unturned!

## Considering iterating Swell in the future?

Feel free to check out the `DEV-README.md` in the `docs` folder.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
