# Multiplayer Chess

## Introduction

Inspired by the iconic game of chess, this app was built using plain HTML/CSS and Javascript for the front end and Node for the BackEnd. To create the socket/server interface, Express alongside SocketIO were used to facilitate the interactions between different users of the app, enabling the multiplayer feature between those users. This app was then finally deployed on Heroku.

## Installation/Usage
 
To use this app, you can either go to this link https://chess-ml.herokuapp.com/ or install the project locally. 

## Installation Steps

In order to install this project local open up a terminal and clone the repository into whichever folder you choose like such

```bash
$ cd myFolder
$ git clone https://github.com/Mattli8312/chess-ml.git
```

Once you've cloned the repository, install all necessary dependencies. Make sure to have Node installed on your computer. 

If you do not have Node installed, follow this link to install Node in order to have access to npm:
https://nodejs.org/en/download/ 

Then, install the proper dependencies used by this app. You can look at the package.json file for specificiations:

```bash
$ npm install --save express 
$ npm install --save socket.io
```

Finally, open the main directory of the project containing the src and server directories and boot up the server:

```bash 
$ cd chess-ml
$ node ./server/Server.js
```

You should see ```bash Listening on Port 3000``` right below after executing the above commands. Open up a browser and go to localhost 3000. You will see the project running

## Contributions

Anyone is more than welcome to change/add features to this app. If you do so, feel free to make pull requests as I'm sure there is a lot of things that can be added to this app. This project was designed in an Object-Oriented manner which led to many complications throughout the development process, so if there are any major bugs, feel free to open issues and specify what needs to be fixed/added! 