# Product Management Frontend

![Angular](https://img.shields.io/badge/Angular-v17+-red.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A modern Angular-based frontend application for managing products and stock operations, built with Angular 17+ and Tailwind CSS.

## Features

* **Product Management**:

  * Create, view, edit, and delete products
  * View product details in modal

* **Stock Operations**:

  * Increase/decrease stock quantities
  * Visual indicators for stock status

* **User Experience**:

  * Responsive design with Tailwind CSS
  * Error handling with user-friendly notifications
  * Confirmation dialogs for destructive actions

## Prerequisites

* Node.js 
* npm 
* Angular CLI 

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/product-management-frontend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd product-management-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Running the Development Server

```bash
ng serve
```

Navigate to [http://localhost:4200/](http://localhost:4200/). The application will automatically reload if you change any of the source files.

### Building for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Running with Docker

### Build the Docker image:

```bash
docker build -t product-management-frontend .
```

### Run the container:

```bash
docker run -p 80:80 product-management-frontend
```

## Configuration

The application connects to a backend API by default at `http://localhost:8222/api`. To change this:

* Edit the `apiUrl` in `src/app/services/product.service.ts`
* Rebuild the application if running in production

## Technologies Used

* **Frontend Framework**: Angular 
* **Styling**: Tailwind CSS
* **Build Tool**: Angular CLI
* **Containerization**: Docker

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
