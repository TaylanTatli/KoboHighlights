# KoboHighlights

KoboHighlights is a web application designed to extract and display highlights from the KoboReader.sqlite file.

## Table of Contents

- [KoboHighlights](#kobohighlights)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
    - [Requirements](#requirements)
    - [Steps](#steps)
  - [Usage](#usage)
  - [Docker Usage](#docker-usage)
  - [Future Plans](#future-plans)
  - [Contributing](#contributing)
  - [License](#license)

## Description

This project enables users to upload their KoboReader.sqlite file and view a list of books with highlights and the highlights themselves.

## Features

- Extract highlights from KoboReader.sqlite file
- Multi-language support (English and Turkish)
- Dark mode support
- Resizable panels
- Responsive UI

## Installation

To run the project locally, follow these steps:

### Requirements

- Node.js (>=14.x)
- pnpm (>=6.x)

### Steps

1. Clone the repository:

    ```sh
    git clone https://github.com/TaylanTatli/kobohighlight.git
    cd kobohighlight
    ```

2. Install dependencies:

    ```sh
    pnpm install
    ```

3. Start the development server:

    ```sh
    pnpm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Upload your `KoboReader.sqlite` file.
2. View and manage your highlights.

## Docker Usage

To run the project using Docker, follow these steps:

1. Build the Docker image:

    ```sh
    docker build -t kobohighlight .
    ```

2. Start the Docker container:

    ```sh
    docker run -p 3000:3000 kobohighlight
    ```

3. Open your browser and navigate to `http://localhost:3000`.

## Future Plans

- Enhanced UI/UX
- Export annotations
- Send to services via services APIs

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
