# Payes Ton Dessin
<div align="center">
<img src="https://img.shields.io/badge/node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>
<img src="https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
<img src ="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
</div>
<div align="center">
<a href="https://badge.fury.io/js/react"><img src="https://badge.fury.io/js/react.svg" alt="npm version" height="18"></a>
</div>

---

## Requirements

* Node.js 
* Good Base in React.js and Socket.io
* Npm

---

## Introduction

This app is an app build for a evaluation. It's a game where you have to make someone guess what the word is, you have to set the words before the game start. it's a local multi player game so that mean that if you want to play with some friends you have to be on the same network.

During the game you can draw what you want in a scare, you can change the color you're using, you can erased what you've draw previously and the others have to find what you're drawing. They have some times to find it and there is a time before the letters appear for the people that are searching for what you're drawing, for help them to find the word.
---
## Installation

First you have to clone the repo.

```sh 
git clone https://github.com/tutur0001/payeTonDessin 
```

After that done you will need to have two tabs Terminal opened they have to be where you have previously clone the repo.
You will have two folder : 'back' and 'front'.

- ### First :
    With one of the terminal you have to go in the back folder.

    Then you have ton do :
    ```sh
    cd back
    npm install
    ```
    or for OSX :
    ```sh
    cd back
    sudo npm install
    ```
    With the other terminal go in the front folder.

    And you have to do the same thing that you do for the back folder : 
    ```sh
    cd front
    npm install
    ```

- ### Second : 
    In both treminal do a 
    ```sh
    npm start
    ``` 
    and with the second terminal
    ```sh 
    cd back 
    npm start
    ```
    now a window in your default internet explorer is open with the game open.

- ### Third :
    For play with your friend on other machine not on localhosts. You have to go in the folder `front`  in `src` and open `index.js` with what you want like for exemple  <a href="https://code.visualstudio.com/"><img src="https://img.shields.io/badge/-visualstudiocode-007ACC"></a> and you have to change the line number `18` :
    ```js
    const ENDPOINT = 'http://localhost:8000',
    ```
    You have to go in the terminal where you've done `npm start`for the front folder. Here is some line and a line say 

    `On Your Network: https://xxx.xxx.xxx.xxx:3000/`

    you have to copy this address and paste it on the line `18` of the `index.js` file and to replace the `3000` at the end of the url by `8000`. 
    
    You have to do a restart in the terminal of the front folder by doing a [ctrl + C] and :
    ```sh 
    npm start
    ```

- ### All done
    Now people that want to play with you have to go on your adresse, the one you've paste on your `index.js` file, and when whey are on the website they have to choose a username, like you of course and when you create a game you've got a little box on the left where it's written code partie : xxxxx , for let the other come in your game they have to enter the code partie and when it's done you're all in the game, enjoy !!
---
## Release History

* 1.0
    * Start stable version of project

---
## Meta

Michon Arthur – michon-arthurpro@protonmail.ch

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/tutur0001](https://github.com/dbader/)