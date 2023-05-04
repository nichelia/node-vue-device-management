# Backend API

## About

This repository contains the source code for the Node-based backend API. 
For more information about this project, please read the `README.md` file at the root.

## Development

### Prerequisites

To get started with development, you will need the following software installed on your system:

- [Docker Desktop](https://docs.docker.com/desktop/release-notes/)
- [Taskfile](https://taskfile.dev)
- [Docker Dev Environments enabled](https://docs.docker.com/desktop/dev-environments/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Visual Studio Code Remote Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Setting up the Development Environment

To set up the development environment, follow these steps:

- Clone the repository to your local machine or untar the project to a directory (refered to as `project-directory`).
- Open a terminal and navigate to the project directory.
- Ensure that Docker dev is running by executing the command:

    ```bash
    task dev-check

    # Expected outcome
    GIT         VSCODE        REMOTE_CONTAINERS
    true        true          true
    ```

- Start the development environment by running the below command. This will create four containers: one for the `api-dev` service, one for the `ui-dev` service, one for the `proxy` service and one for the `db` service.

    ```bash
    task dev
    ```

- When prompted, choose the container with the name `device-management-dev-api-dev-1` to open in VSCode. 
- To see the logs of the containers, run the command:

    ```bash
    task dev-logs
    ```

- To run the CLI, execute the following commands within a container terminal:

    ```bash
    cd api
    yarn start
    ```

- To access the server on a browser, go to `http://localhost:8000`:
- To cleanup the docker dev environment, run the command:

    ```bash
    docker dev-cleanup
    ```

## Notes

- Source code is based on Node 18.
- Docker Development Environment has been tested on Docker Desktop 4.17.0 (99724) for Mac M1 (Docker Compose version v2.15.1, Docker Dev version v0.1.0 (4574c10)).