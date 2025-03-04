
import swaggerJSDoc, { Options } from 'swagger-jsdoc';

// Define the Swagger specification type
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'User Management API',
    version: '1.0.0',
    description: 'API documentation for managing users and their roles',
  },
  servers: [
    {
      url: 'http://localhost:8000/',
      description: 'Local API server',
    },
  ],
};

// Define the Swagger options
const options: Options = {
  swaggerDefinition,
  apis: ['./src/routers/*.ts', './controllers/*.ts'], // Paths for your routes and controllers
};

// Generate the Swagger specification
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
