# Integration between `bpmn-visualization` and `pm4py`
This is a template bootstrap for the integration example between [bpmn-visualization](https://github.com/process-analytics/bpmn-visualization-js/) and [PM4PY](https://github.com/pm4py).

## Prerequisites

💁 **You can skip this part if your system meets all the requirements listed below.**

### Backend part:

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
### Frontend part:
* `nvm`: Node version manager to install `Node.js` and `npm`:
  * **Windows**:
    1. Donwload the latest release of `nvm-windows` from https://github.com/coreybutler/nvm-windows#readme. 
    2. Click on `.exe` file to install the latest release.
    3. Complete the installation wizard
    4. When done, you can confirm that nvm has been installed by running:
    ```sh
    nvm -m
    ```
  * **Unix/MacOS**: 
    1. In your terminal, run the nvm installer by using `cURL` or `Wget` commands depending on the command available on your device. These commands will clone the nvm repository to a ~/.nvm directory on your device:
    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

    #or

    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    ```
    2. Update your profile configuration: Running either of the above commands downloads a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`). If it doesn't automatically add nvm configuration, you can add it yourself to your profile file:
    ```sh
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" 
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
    ```
    3. When done, you can confirm that nvm has been installed by running:
    ```sh
    command -v nvm
    ```
    4. If you run into problems, you can check the complete documentation available here: https://github.com/nvm-sh/nvm#installing-and-updating
* `Node.js` and `npm`: Use `nvm` to install, and use, the current latest stable version of `Node.js` and `npm` by running: 
  ```sh
  nvm install --lts
  ```
  Verify it worked by running:
  ```sh
  node --version
  ```
  ```sh
  npm --version
  ```

## Setup
1. Clone the project template in your preferred IDE (e.g. VScode)
2. Prepare the backend environment:
    1. Navigate to the `backend` folder: `cd backend`
    2. Create a virtual environment for dependencies called `venv` using the following command: `python -m venv venv`
    2. Install the required libraries listed in `requirements.txt`by running:
    ```sh
    pip install -r requirements.txt
    ```
3. Prepare the frontend environment:
    1. Navigate to the `frontend` folder: `cd ../frontend` 
    2. Install the required libraries listed in `package.json` by running:
    ```sh
    npm install
    ```


