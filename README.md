# Freelancerio

[![Coverage Status](https://coveralls.io/repos/github/LuvoZulu/Freelancerio/badge.svg?branch=main)](https://coveralls.io/github/LuvoZulu/Freelancerio?branch=main)

## Introductions

Many businesses and individuals hire freelancers but struggle to manage contracts, payments, and deliverables efficiently. Freelancers also face challenges in
tracking their projects and payments.
This project aims to create a web-based platform where freelancers and clients can manage contracts, communicate, and track project progress.

## Objectives
The team is required to use Agile methodology, incorporate CI/CD principles, and take a test-driven approach to design, develop, and operationalize a publicly
available web-based application that meets the following requirements.

### Overview of Features
- Job posting & applications
- Contract & task management
- Payment tracking


## Release
- We will release using Microsoft's Azure

## Documentation
https://docs.google.com/document/d/1omweQAGiLbiPovICOlfuyGYw2DZ73XCHJTlLGX7UjfY/edit?usp=sharing

## 🛠️ Running the Application Locally

To run the Freelancerio web app on your local machine:

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/LuvoZulu/Freelancerio.git
```

### 2. Open the project folder

You can do this in one of two ways:

#### Option A: Using a text editor like VS Code

- Locate the newly created `Freelancerio` folder on your machine (usually on your Desktop or in your user folder).
- Right-click the folder and select **"Open with Code"** (or open it manually from within your editor).
- Once inside the project, open a terminal in the editor.

#### Option B: Using a terminal directly

- Open a terminal on your computer.
- Navigate to the project folder using the `cd` command:

```bash
cd path/to/Freelancerio
```

Replace `path/to` with the actual path where the folder was cloned (e.g., `cd Desktop/Freelancerio`).

### 3. Install dependencies

In the terminal, run:

```bash
npm install
```

### 4. Start the server

After installation finishes, start the server with:

```bash
npm start
```

This will launch the application at:

```
http://localhost:3000
```

Paste the link in your browser or click on it to view the app.

> **Note:** Ensure you have a valid `.env` file in the root directory if required (see documentation for environment variable setup).
