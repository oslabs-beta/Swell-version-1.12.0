# Contributing to Swell in the context of a group/medium-term project

If you are considering contributing to Swell in the context of a group or medium-term project, you are at the right place! Here is a document that will give you more information regarding the state of the product and some considerations for future iteration.

---

## As a developer, what experience can you get out of contributing to Swell?

- TypeScript + JavaScript
- React
- Redux
- SASS
- Node
- Express
- Webpack
- Client-side storage (IndexedDB)
- Testing
  - Unit testing with Jest
  - End-to-end (E2E) testing with Playwright and Mocha
- Advanced and/or specialized knowledge on:
  - Electron
  - APIs: HTTP/2, GraphQL
  - API served over streaming technologies:
    - Server-Sent Events (SSE)
    - WebSockets
    - gRPC
    - tRPC
    - WebRTC
    - OpenAPI

---

## How to download and test the application locally?

1. Fork and/or clone the repository into your local machine
2. In your terminal:
   - `npm install`, then
   - `npm run dev`
3. Wait for the electron application to start up (it may take a bit)

There is E2E testing available via `npm run test`. Note that not all tests in the E2E test suite work currently. Please refer to `./test/testSuite.js` for more details.

---

## What is the way to render electron app during development for WSL users?

WSL and Electron does not work well together - the application won't load when using `npm run dev`. We have a few solutions you can try, but it is not by any means the only way or even guarenteed method.

- One solution suggestion is to download the repo directly on your windows machine and not use WSL.
  - You can right-click on the bottom-left of your VSCode and uncheck remote host so that you still get the command-line functionalities.
- Another solution is to use `Xserver` (graphical interface for linux) to render things from Linux onto your Windows.
  - [This article](https://www.beekeeperstudio.io/blog/building-electron-windows-ubuntu-wsl2) was really helpful in getting things to work
  - There is another article [here](https://skeptric.com/wsl2-xserver/) that you may want to check out. The two difference that diverges from the articles instructions is on WSL Config step with `.bashrc` file and `VcsXsrv` config step 3
    - inside of your `.bashrc` File:
      - You should add this following script instead of what they put: `export DISPLAY=$(/sbin/ip route | awk '/default/ { print $3 }'):0`
    - `VcsXsrv`: check Disable access control as well.
  - After these steps, you will have to enable WSL to access `Xserver` on Windows Firewall(refer to the [skeptric](https://skeptric.com/wsl2-xserver/) article)
  - If `x11 calc` is able to pop-up, it means everything is working well.
- There is a long load time when running the server, it may take a few minutes.

---

## What is the current state of the application?

From a functionality standpoint:

- Consistent UI/UX styling and color palette
- Make requests via HTTP/2
- Query, Mutation, Subscribe/unsubscribe to GraphQL endpoints
- HTTP/2 stress testing with `GET` requests
- GraphQL stress testing with `Query`
- Mock server for HTTP/2 (`Express`)
- Ability to store historical requests and create/delete workspaces

From a codebase standpoint:

- Partial conversion to TypeScript
- Conversion to Redux toolkit _almost_ complete
- Most working E2E testing (more details in `./test/testSuite.js`)

---

## What are some of the features that require future iterations?

### _Continue reducing the size and complexity of the codebase_

This codebase has an interesting combination of over-modularization and code de-centralization/duplication occurring at the same time. For example - each type of API endpoint composer window (top right section of the app) is its own module/file, but a lot of the code inside is duplicated (see `Http2Composer.tsx` and `GraphQLComposer.tsx`).

The impacts to the product are:

- The codebase can be incredibly difficult to navigate if you are not familiar with the structure
- The app is slow to load in all environments (production, development, test)

**Some of us have found [ReacTree](https://reactree.dev/) VS Code extension incredibly helpful in visualizing the UI components. Utilizing the extension could be your entry into understanding the structure of the codebase.**

As you iterate the product, keep in mind the footprint your new feature could add to the codebase. Could you re-use some of the existing modules? Can you even refactor and/or remove the obsolete code to help maintain the health of the codebase?

### _Ensure consistent redux state management_

The redux state initiation and management for various API endpoints in this codebase is inconsistent. If you cross reference the state initialization, transition/update and clean up in various modules with `types.ts`, you will notice many TypeScript typing error due to inconsistent state management. This will need to be cleaned up bit by bit to ensure a state that works across all types of APIs in this application.

### _Basic functionality for more advanced APIs not working as expected_

For the following technologies - if you reference the gifs in `readme` and try to replicate the steps in the application you may not get the same result:

- gRPC
- tRPC
- OpenAPI

If future groups have a desire to iteration on the above features, please ensure the basic functionality works as expected, update E2E testing in `./test/testSuite.js` before adding new features.

### _Continue improving UX/UI consistency in the app_

The UX/UI styling and functionality is not consistent across different API endpoints. For example, there is a `Send Request` button for HTTP/2, but not for GraphQL.

Moreover, the application lacks instructions on how to utilize some of the more advanced features like WebSocket and tRPC. Having some written explanation on how the feature works on the app would be tremendously helpful.

Lastly, when making the app smaller on windows desktop or using a computer with smaller screen size, some of the buttons are partially cut out. It would be great to establish a minimum size for each section and/or input field so the application can auto-resize elegantly.

### _Continue conversion to TypeScript, Material UI and Redux toolkit_

Conversion to Material UI allows a more consistent component style and promotes semantic HTML language throughout the application. TypeScript provides strong typing to improve code quality, maintainability and reduce runtime errors. Redux toolkit reduces the amount of boilerplate requires to use Redux within the application and provide a centralized environment for state initialization and management.

### _Enhance HTTP/2 Mock server functionality; expand feature to GraphQL_

Currently, the HTTP/2 mock server has the ability to create a server that is accessible outside of the application, and create any endpoint that the user chooses. There could be a lot of potential to enhance the current mock server to include features such as:

- Add an option to see the list of existing routes that shows up in the response window
- Add endpoint validation
- the ability to mock HTML responses (or remove the HTML option from the BodyEntryForm component)
- Connect the headers and cookies to the mock endpoint creation

Moreover, the mock server functionality can be extended to GraphQL as well so that is something that can be considered in the future.

### _WebRTC STUN/TURN server input is read-only_

The `RTCConfiguration` format required for WebRTC STUN/TURN server is an object with `iceServers` as the key and an array of objects as the value. With the current input format on the application, it is very difficult and error-prone to attempt to format the user input correctly. Based on research it seems like many other alternatives that test STUN/TURN servers separate each key/value into its input text box (similar to how key/value pairs for headers are done for HTTP/2 in Swell). Our assumption is that this way the application can have better control formatting `RTCConfiguration`. If anyone is considering advancing the current WebRTC functionalities in the future, this should be a priority so we can fully enable the ability to test any STUN/TURN servers using Swell.

### _Incomplete E2E testing coverage_

Some of the following features either have broken, or no E2E testing coverage in the repository:

- gRPC
- tRPC
- OpenAPI
- Mock server

Future iteration should consider fix or add E2E testing coverage for these features.

### _Broken Travis CI build_

The [Travis CI link](https://travis-ci.org/open-source-labs/Swell) is not functional. A broken CI/CD pipeline blocks the ability to automatically package and release new iterations of the application, so it would be great if we can rebuild CI/CD using alternative services like GitHub Actions.

---

## How can I package and release the application without a functional CI/CD pipeline?

There are a few options to package an electron app for production. Some of the most popular options are electron forge and electron builder, and Swell uses electron builder currently.

If you choose to package the application locally, by default the packaged app is intended for the same local environment - meaning if you packaged the app on MacOS, the installer would be intended for MacOS environments.

While electron builder supports [multi-platform build](https://www.electron.build/multi-platform-build.html), there are some limitations when building locally.

For Mac users, running `npm run package-mac` and `npm run package-win` (as defined in `package.json`) would allow you to package the Swell app for Mac and Windows environment. If you try to package for the linux environment (i.e. `npm run package-all`, `npm run package-linux`, `npm run gh-publish`), you will run into issues requiring `snapcraft` and `multipass` to create a linux virtual machine in order to package the application. You can try to install `snapcraft` and `multipass` via `brew` per instructions, but there has not been much success locally.

The only remaining option to build a linux package for MacOS users is via a CI/CD tool like Travis CI or GitHub Actions but the pipeline is not functional in the Swell repository. **To work around this limitation without building a new CI/CD pipeline, we recommend you ask a developer with a WSL or Linux environment to help you package the application.**

- Ask the developer to clone the project into their local WSL/Linux environment. **The user does not need the ability to open the electron application.**
- run `npm install && npm run package-linux`
- The process will take a while, but the output will consist the installer for the linux environment, along with `latest-linux.yml` required for the auto-updater. The output can usually be found in the `release` folder in the repository directory. Read the terminal carefully to determine the directory path if that is not the case.

All releases should be done in GitHub. There are many resources on how to create a release in GitHub. The following files should be included as assets:

- Windows installation: `Swell-Setup-<version>.exe`, `Swell-Setup-<version>.exe.blockmap`
- MacOS installation: `Swell-<version>.dmg`, `Swell-<version>.dmg.blockmap`, `Swell-<version>-mac.zip` (somewhat optional)
- Linux installation: `Swell-<version>.AppImage`
- x86-64: `Swell_<version>_amd64.deb`
- YAML files for auto-updater: `latest-linux.yml`, `latest-mac.yml`, `latest.yml`
- Source code in `zip` and `tar.gz` formats

See [Swell's release page](https://github.com/open-source-labs/Swell/releases) for examples.

---

## How can I update [Swell's website](https://getswell.io/) after the iteration?

The website is hosted on AWS, which means you will need credentials to access the files (in S3 buckets) for the latest version of the website. You will need to contact OS Labs for the credentials, or if you are iterating the product as part of a Codesmith program they should have access to the information needed.

Things to consider updating:

- Ensure the download links are pointing to the latest version
- Any videos/screenshots that have been updated
- Any new feature(s) you want to showcase
- Add your names, headshots and relevant information in the `contributors` section

---

## Maintaining this document

This should serve as an entry point for any developers who wish to iterate on Swell and therfore, should be kept as up-to-date as possible. **At the end of your iteration, you are strongly encouraged to update this document for future developers.**

Thank you for your consideration and let's work on making Swell one of the best open-source products to contribute!

