# React Hook Example

This project demonstrates the use of React hooks in a simple application. It uses the `@asmozia/react-odoo` package to interact with an Odoo server.

## Project Structure

The main component of the project is `ReactHookSimplePage.tsx`, which uses the `useOdooClient` hook from `@asmozia/react-odoo` to fetch and display server information.

The `SampleUI.tsx` file contains styled components used for the layout of the application.

## Usage

To use this example, follow these steps:

1. Clone the repository.
3. Install the dependencies with `npm install`.
4. Start the application with `nx run react-hook-example:serve`.

## Components

- `ReactHookSimplePage`: This is the main component of the application. It fetches server information using the `useOdooClient` hook and displays it.

- `SampleUI`: This file contains styled components used for the layout of the application.

## Dependencies

- `react`: A JavaScript library for building user interfaces.
- `@asmozia/react-odoo`: A package for interacting with an Odoo server.
- `styled-components`: A library for styling React components.

## Contributing

Contributions are welcome. Please submit a pull request or create an issue to discuss the changes you want to make.

## License

This project is licensed under the MIT License.
