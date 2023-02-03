# Frontend requirements

You will need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) to be installed on your system. Node.js `installer` is not recommended, since the Node installation process installs `npm` in a directory with local permissions and can cause permissions errors when you run npm packages globally. Node version manager like [nvm](https://github.com/nvm-sh/nvm) is usually recommended as explained below.

* `nvm`: Node version manager to install `Node.js` and `npm`:
  * **Windows**:
    1. Donwload the latest release of [`nvm-windows`](https://github.com/coreybutler/nvm-windows#readme). 
    2. Click on `.exe` file to install the latest release.
    3. Complete the installation wizard
    4. When done, you can confirm that nvm has been installed by running:
    ```sh
    nvm -m
    ```
  * **Unix/MacOS**: 
    1. In your terminal, run the nvm installer by using `cURL` or `Wget` commands depending on the command available on your device. These commands will clone the nvm repository to a `~/.nvm` directory on your device:
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
    4. If you run into problems, you can check the [complete documentation](https://github.com/nvm-sh/nvm#installing-and-updating).
* `Node.js` and `npm`: Use `nvm` to install, and use, the version of `Node.js` and `npm` defined in the `.nvmrc` file: 
  ```sh
  nvm use
  ```
  ```sh
  nvm install
  ```
  Verify it worked by running:
  ```sh
  node --version
  ```
  ```sh
  npm --version
  ```