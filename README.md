# Integration between `bpmn-visualization` and `pm4py`
This is an example integration between [bpmn-visualization](https://github.com/process-analytics/bpmn-visualization-js/) and [PM4PY](https://github.com/pm4py).

## Architecture
The application consists of two main components: the frontend written in JavaScript and the backend written in Python. 
* The frontend uses **bpmn-visualization** to visualize the BPMN process model and the statistics data over it. 
* The backend is built using **pm4py** which processes data to perform process discovery and conformance checking. The results are then communicated to the frontend through [Flask](https://flask.palletsprojects.com/) and [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

In addition to bpmn-visualization and pm4py, the application also leverages two other libraries, [d3](https://d3js.org/) and [BPMN layout generators](https://github.com/process-analytics/bpmn-layout-generators). 
* **d3** is used to manipulate colors and add a legend to the visualized BPMN diagrams.
* **BPMN layout generators** is used to generate the layout of the discovered BPMN process models produced by pm4py. ⚠️ Please note that BPMN layout generators is still in an **experimental version** and may not produce optimal or visually appealing layouts.

![Application architecture](./architecture/architecture.svg)

## Prerequisites

You can skip this part if your system meets all the requirements listed below 👇

* [Backend requirements](./backend/README.md)
* [Frontend requirements](./frontend/README.md)


## Setup
* Clone the project in your preferred IDE (e.g. VScode)
* Prepare the backend environment:
    1. Navigate to the `backend` folder: `cd backend`
    2. Create a virtual environment for dependencies called `venv` using the following command: 
        ```sh 
          python -m venv venv
        ```
    3. Activate the created `venv` by running:
        * **Windows**: 
        ```sh 
          venv\Scripts\activate.bat
        ```
        * **Unix/MacOS**:
        ```sh
          venv/bin/activate
        ```
    4. Install the required libraries listed in `requirements.txt` by running:
        ```sh
          pip install -r requirements.txt
        ```
* Prepare the frontend environment:
    1. Navigate to the `frontend` folder: `cd ../frontend` 
    2. Install the required libraries listed in `package.json` by running:
    ```sh
    npm install
    ```
## Run
1. Navigate to the `backend` folder: `cd backend`
2. Run the application:
    ```sh
    python app.py
    ```
3. Open a new terminal and navigate to the `frontend`folder: `cd frontend`
4. Run the development web server: 
    ```sh
    npm run dev
    ```
5. Access the web application on the displayed localhost: http://localhost:5173/ 

## License

This project is licensed under the GPL-3.0 license because the backend part of the code uses the pm4py library, which is licensed under this license.

The front end part of the code uses the bpmn-visualization library, which is licensed under the Apache-2.0 license. The legends in the project are generated using d3, which is licensed under the ISC license.

Please note that the different licenses may have different requirements, so make sure to review the license terms carefully before using or contributing to this project.