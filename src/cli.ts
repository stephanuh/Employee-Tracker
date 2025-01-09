import inquirer from "inquirer";
import {QueryResult} from 'pg';
import { pool, connectToDb } from './connection.js';

function mainMenu(): void {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Please slect an option', //or Please slect the following options?
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit'
            ],
        },
    ])
    .then((answers) => {
        if (answers.choice === 'View all Departments'){
            viewAllDepartments();
        }
        if (answers.choice === 'View all Roles'){
            viewAllRoles();
        }
        if (answers.choice === 'View all Employees'){
            viewAllEmployees();
        }
        if (answers.choice === 'Add a Department'){
            addDepartment();
        }
        if (answers.choice === 'Add a Role'){
            addRole();
        }
        if(answers.choice === 'Add an Employee'){
            addAnEmployee();
        }
        if(answers.choice === 'Update an Employee Role'){
            updateEmployeeRole();
        }
        if(answers.choice === 'Exit'){
            pool.end();
            process.exit();
        }
    });
}
//TODO: Implement the following functions

function viewAllDepartments(): void {}
function viewAllRoles(): void {}
function viewAllEmployees(): void {}
function addDepartment(): void {}
function addRole(): void {}
function addAnEmployee(): void {}
function updateEmployeeRole(): void {}

await connectToDb();
mainMenu();
