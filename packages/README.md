## Vindigo Packages

These are the packages for the [Vindigo](https://vindigo.app/) monorepo.

- **vindigo-cli** - Used to manage the active vindigo instance
- **vindigo-client** - The frontend vue application served by the backend. Written in TypeScript and vue, and uses Webpack as asset bundler.
- **vindigo-server** - The backend application in charge of running most Vindigo logic. Written in TypeScript and uses gulp as build tool.
- **vindigo-config** - Contains the config definition as used by the server and the CLI.

### Distribution files

Building Vindigo results in distribution files being placed at `app/build`. These files should not be comitted and contain a combination of server and client files.