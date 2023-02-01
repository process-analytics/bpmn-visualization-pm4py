# Backend requirements

It is assumed that the following is installed on your system:

* `Python 3.6` or higher: https://www.python.org/downloads/
* `pip`:
    * **Windows**: The Python installers for Windows include pip. You can make sure that pip is up-to-date by running:
    ```sh
    py -m pip install --upgrade pip
    py -m pip --version
    ```
    * **Unix/MacOS**: Debian and most other distributions include a [python-pip](https://packages.debian.org/stable/python/python3-pip) package. You can also install pip yourself to ensure you have the latest version by running:
    ```sh
    python3 -m pip install --user --upgrade pip
    python3 -m pip --version
    ```

* `venv`: keeps your environments clean by keeping the dependencies in a specific directory for your project. You can install virtualenv by running:
    * **Windows**:
    ```sh
    py -m pip install --user virtualenv
    ```
    * **Unix/MacOS**:
    ```sh
    python3 -m pip install --user virtualenv
    ```

* `Graphviz`: pm4py uses Graphviz to encode the structure of process models. It is the only software that needs to be installed on your system from https://graphviz.org/download/. 