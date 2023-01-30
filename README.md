# Integration between `bpmn-visualization` and `pm4py`
This is a template bootstrap for the integration example between [bpmn-visualization](https://github.com/process-analytics/bpmn-visualization-js/) and [PM4PY](https://github.com/pm4py).

## Prerequisites

You can skip this part if your system meets all the requirements listed below 👇

* [Backend requirements](./backend/README.md)
* [Frontend requirements](./frontend/README.md)


## Setup
* Clone the project template in your preferred IDE (e.g. VScode)
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


