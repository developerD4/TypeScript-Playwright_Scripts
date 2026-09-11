import dotenv from 'dotenv';

const environment = process.env.TEST_ENV || 'qa';

dotenv.config({
    path: `.env.${environment}`
});

export const baseUrl = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

export const environmentName = process.env.ENVIRONMENT || '';

//Definition: Environment configuration keeps values such as URLs outside the test code.
// # set TEST_ENV=qa
// # npx playwright test