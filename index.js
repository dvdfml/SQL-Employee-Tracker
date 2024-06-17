import select from '@inquirer/select';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool(
    {
        // TODO: Enter PostgreSQL username
        user: 'postgres',
        // TODO: Enter PostgreSQL password
        password: 'vegetable',
        host: 'localhost',
        database: 'employees_db'
    },
    console.log(`Connected to the movies_db database.`)
)

const displayOptions = async () => {
    let answer;
    answer = await select({
        message: 'What would you like to do?',
        choices: [
            {
                value: 'View All Employees'
            },
            {
                value: 'Add Employee'
            },
            {
                value: 'Update Employee Role'
            },
            {
                value: 'View All Roles'
            },
            {
                value: 'Add Role'
            },
            {
                value: 'View All Departments'
            },
            {
                value: 'Add Department'
            }]
    })

}

pool.connect();

displayOptions();