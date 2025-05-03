# SChare - an implementation of the blockchain service as a service framework streamlining the complex integration of multiple blockchain services.

This application provides a platform for:

- Blockchain service developers to register and expose their service for others to use.
- Blockchain application developers to easily consume desired services to facilitate their development.
- Researchers to integrate, test and analyse novel blockchain applications with ease.

Blockchain services should be containerized or deployed before registered on the platform. The current version is mainly for researching and testing purpose. Therefore, security and scalability are not fully considered. Please do not publish any sensitive information on the platform.

Deployed SChare application can be accessed at: https://baas-db.fly.dev

# Contents

- [Manual Deployment](#manual-deployment)

# Project Dependencies

- MongoDB ([Install MongoDB](https://docs.mongodb.com/manual/administration/install-community/))
- Firebase Cloud Messaging ([FCM Details](https://firebase.google.com/docs/cloud-messaging))
<!-- - Kafka ([Kafka QuickStart](https://kafka.apache.org/quickstart)) -->

# <a id="manual-deployment"></a>Manual Deployment

## Setup Node.js

Inorder to setup NodeJS you need to fellow the current steps:

### Mac OS X

- Step1: Install Home brew

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

$ brew -v
```

- Step2: Install Node using Brew

```
$ brew install node

$ node -v

$ npm -v
```

### Linux Systems

- Step1: Install Node using apt-get

```
$ sudo apt-get install curl python-software-properties

$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

$ sudo apt-get install nodejs

$ node -v

$ npm -v
```

## Setup and run test application

- Step1: Git clone the application

- Step2: Install node modules

```
$ npm i

or

$ npm install
```

```
$ npm i -g @babel/core @babel/node @babel/cli
```

- Step3: Copy .env.example to .env

```
$ cp .env.example .env
```

- Step4a: Start the application

```
$ npm start
```

- Step4b: Start With Nodemon

```
$ npm run startWithNodemon
```

## Build

```
$ npm run build
```

## Starting the build

```
$ npm run deployment
```

The current version of your application would be running on **http://localhost:8000** or **http://IP_OF_SERVER:8000** (in case you are running on the server)
