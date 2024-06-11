# SmartEats Backend

SmartEats Backend is a TypeScript-based Express.js REST API for the SmartEats project. It provides the backend services necessary for managing and serving data for the SmartEats application.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Linting and Code Formatting](#linting-and-code-formatting)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18 or higher)
- Yarn (v1.22 or higher)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:ESP-SmartEats/backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd backend
   ```

3. Install project dependencies:

   ```bash
   yarn install
   ```
4. Setting Environment variables:
   ```bash
   cp .env.sample .env
   ```
    Then add value to these environment variables, example:
    ```bash
      EDAMAM_URL=https://api.edamam.com/api/recipes/v2
      
      PORT=8080
      IP=localhost
    ```
## Project Structure

The project is structured as follows:

- `src/`: Contains the source code of the Express.js application.
- `dist/`: Output directory for the compiled TypeScript code.
- `config/`: Configuration files, such as environment variables.
- `routes/`: Route definitions for the API.
- `tests/`: Unit tests.
- `.husky/`: Husky hooks configuration.

## Usage

To start the development server with hot-reloading, run:

```bash
yarn dev
```

To build the TypeScript code into JavaScript, run:

```bash
yarn build
```

To start the production server, run:

```bash
yarn start
```

## API Routes

The SmartEats API provides the following routes:

- `GET /`: Root endpoint for testing the API.

Each route has specific functionalities; please refer to the codebase and documentation for details.

## Environment Variables

The application uses the following environment variables. Create a `.env` file in the root directory and define these variables as needed.

- `PORT`: The port for the Express.js server.
- (Add more environment variables as needed)

## Scripts

- `yarn start`: Start the production server.
- `yarn dev`: Start the development server with hot-reloading.
- `yarn build`: Build the TypeScript code into JavaScript.
- `yarn lint`: Lint the code using ESLint.
- `yarn format`: Format the code using Prettier.
- `yarn commit`: Create a conventional commit message.

## Linting and Code Formatting

The project uses ESLint for code linting and Prettier for code formatting. To lint your code, run:

```bash
yarn lint
```

To format your code, run:

```bash
yarn format
```

## Contributing

Contributions are welcome! Please follow the conventional commit format for your commit messages. If you're new to this format, you can use `yarn commit` to help you create compliant commit messages.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to expand this README further with more specific details about your API, its endpoints, and any additional features or configurations that might be relevant to users and contributors.
