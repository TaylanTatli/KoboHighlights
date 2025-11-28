# ![Hylit Logo](./.github/assets/logo.svg#gh-light-mode-only) ![Hylit Logo](./.github/assets/logo-dark.svg#gh-dark-mode-only)

Hylit (previously KoboHighlights) is a web application designed to extract and display highlights from the **Kobo (KoboReader.sqlite)** and **Kindle/KoReader (My Clippings.txt)** and send them to **Notion** or **Hardcover**.

![Hylit Preview](./.github/assets/preview.png)

## :books: Table of Contents

- [:books: Table of Contents](#books-table-of-contents)
- [:book: Description](#book-description)
- [:sparkles: Features](#sparkles-features)
- [:gear: Installation](#gear-installation)
  - [:clipboard: Requirements](#clipboard-requirements)
  - [:hammer\_and\_wrench: Steps](#hammer_and_wrench-steps)
- [:rocket: Usage](#rocket-usage)
- [:whale: Docker Usage](#whale-docker-usage)
- [:cloud: Deploy on Vercel / Netlify](#cloud-deploy-on-vercel--netlify)
- [:crystal\_ball: Future Plans](#crystal_ball-future-plans)
- [:handshake: Contributing](#handshake-contributing)
- [:coffee: Supporting The Project](#coffee-supporting-the-project)
- [:scroll: License](#scroll-license)

## :book: Description

This project enables users to upload their KoboReader.sqlite or My Clippings.txt file and view a list of books with highlights and the highlights themselves. Users can also send these highlights to Notion or Hardcover.

## :sparkles: Features

- Extract highlights from KoboReader.sqlite file (Kobo)
- Extract highlights from My Clippings.txt file (Kindle/KoReader)
- Display highlights in a user-friendly interface
- Send highlights to Notion and Hardcover
- Save highlights to local storage for offline access
- Multi-language support (English and Turkish)
- Docker support for easy deployment
- Responsive UI

## :gear: Installation

To run the project locally, follow these steps:

### :clipboard: Requirements

- Node.js (>=14.x)
- pnpm package manager
- Docker (optional)

### :hammer_and_wrench: Steps

1. Clone the repository:

   ```sh
   git clone https://github.com/TaylanTatli/hylit.git
   cd hylit
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. (Optional) Create a `.env` file in the root directory and add your environment variables:

   ```sh
   NEXT_PUBLIC_NOTION_PAGE_ID=your_notion_page_id
   NEXT_PUBLIC_NOTION_API_KEY=your_notion_api_key
   ```

   This is only necessary if you want to predefine your page ID and API key. If you don't create this file, you will need to enter your page ID and API key when you send highlights to Notion. These values will be saved to local storage for next time.

4. Start the development server:

   ```sh
   pnpm run dev
   ```

## :rocket: Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Upload your `KoboReader.sqlite` or `My Clippings.txt` file.
3. View the list of books and their highlights.
4. Optionally, send highlights to Notion or Hardcover by entering your API credentials, or download them to your PC.

## :whale: Docker Usage

To run the project using Docker, follow these steps:

1. Build the Docker image:

   ```sh
   docker build -t hylit .
   ```

2. Start the Docker container:

   ```sh
   docker run -p 3000:3000 hylit
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## :cloud: Deploy on Vercel / Netlify

You can deploy this project to Vercel or Netlify by clicking the buttons below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/TaylanTatli/Hylit)
[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TaylanTatli/Hylit)

## :crystal_ball: Future Plans

- Improve the user interface and user experience
- Add more export options (e.g., PDF)

## :handshake: Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## :coffee: Supporting The Project

If you like the project and want to support me, You can <a href="https://www.buymeacoffee.com/taylantatli" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 30px;width: auto;vertical-align: middle;" ></a>

## :scroll: License

**Copyright (C) 2025 Taylan Tatli**

This project is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

You are free to use, modify, and distribute this software under the terms of the AGPLv3. See the [LICENSE](LICENSE) file for the full text.
