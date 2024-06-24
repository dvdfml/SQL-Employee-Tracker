# SQL-Employee-Tracker

## Description

SQL: Employee Tracker is a command-line application that manages a company's employee database, using Node.js, Inquirer, and PostgreSQL.

## Installation

This application requires [PostgreSQL](https://www.postgresql.org), [Node.js](https://nodejs.org/) and the package manager [npm](https://www.npmjs.com/).

Open the terminal in the root directory of the application and run the following command:

```bash
npm i
```
This will install the [Inquirer](https://www.npmjs.com/package/inquirer) and [pg](https://www.npmjs.com/package/pg) packages needed to run the application.
Then, connect to the psql interface, usually done with the command:

```bash
psql -U postgres
```
> [!CAUTION]
> The database is called employees_db. Make sure you don't already have a database with the same name. Running the following command will drop that database and create a new one.

Run the psql command:

```psql
\i db/schema.sql
```
This will create the PostgreSQL database.

## Usage
To run the application, open the terminal in the root directory of the application and run the following command:
```bash
node index.js
```
If the application was initiated succesfully, ASCII art with the application name will be displayed and you will be prompted to chose between several options.
```
/======================================================\
||                                                    ||
||                                                    ||
||   _____                 _                          ||
||  | ____|_ __ ___  _ __ | | ___  _   _  ___  ___    ||
||  |  _| | '_ ` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \   ||
||  | |___| | | | | | |_) | | (_) | |_| |  __/  __/   ||
||  |_____|_| |_| |_| .__/|_|\___/ \__, |\___|\___|   ||
||                  |_|            |___/              ||
||   _____               _                            ||
||  |_   _| __ __ _  ___| | _____ _ __                ||
||    | || '__/ _` |/ __| |/ / _ \ '__|               ||
||    | || | | (_| | (__|   <  __/ |                  ||
||    |_||_|  \__,_|\___|_|\_\___|_|                  ||
||                                                    ||
||                                                    ||
\======================================================/

? What would you like to do? (Use arrow Keys)
> View All Employees
  View Employees by Manager
  View Employees by Department
  Add Employee
  Update Employee's Role
  Update Employee's Manager
  View All Roles
```
Use the arrow keys to move between options and select them with the enter Key.

## Demo
[Video]