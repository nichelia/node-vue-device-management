# node-vue-device-management

## About
A simple Node / Vue Fullstack Device Management as part of the interview process with TympaHealth.

## Description
The purpose of this exercise is to help any store manager to have a friendly interface which allows them to manage any items in their shop.
It should also help them find an item by brand or model, and to see more details using a simple search.

## Requirements & Assumptions

### Requirements

1. Backend RESTful API using NodeJS with any Framework
2. Persistence using PostgreSQL or MySQL database
4. Dockerised Environment
5. Frontend using VueJS with Vuetify
6. Frontend Tabular UI using the Data Tables component

### Assumptions

1. The `GET` endpoint for the devices in the Backend API service is not paginated. This may introduce memory and latency issues depending on the number of devices added to the database.

## Future Improvements

1. Unit testing. Both Frontend and Backend lack of any unit testing of their core functionality.
2. Better configuration of both backend and frontend services. For example, currently the Frontend has the Backend API url hardocded instead being configuratble through environment variables for example.

## Run

### Prerequisites

Before you can run the stack, you will need to install the following software on your system:

- [Docker Desktop](https://docs.docker.com/desktop/release-notes/)

### Execute application

To run the stack, follow these steps:

- Clone the repository to your local machine or untar the project to a directory (referred to as project-directory).
- Open a terminal and navigate to the project directory.
- To run the stack, execute the following command. This command will build the production version of the stack and execute four services: the backend api, the frontend, the database and the proxy.

```bash
docker compose up
```

- To clean up after running the stack, run the following command:

```bash
docker compose up down --rmi all
```

This will stop the services and remove the images.