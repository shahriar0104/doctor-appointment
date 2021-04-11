# DoctorAppointment

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.4.

## Development server

First start the `mock server`. Mock server is in the  `src/mock-server` folder.
Instal `json-server` globally by this command `npm install -g json-server` or go to the folder `src/mock-server` &
run `npm install json-server --save`. Then inside `src/mock-server` start a `command promt or CMD` &
write `json-server doctors.json`. The mock server will run at port `3000`.
Then Run `npm start` for a dev server. The `npm start` command will automatically open in your browser at 
port `4200` OR Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Specific production and staging command added in `package.json` file.
U can run `npm prod` for production build & `npm staging` for staging build or u can change that command as your need.
The build artifacts will be stored in the `dist/` directory. The `--prod` flag & `root` directory also set in those commands for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
