import { faker } from '@faker-js/faker';

export function generateEmployeeData() {

    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        employeeId: faker.string.numeric(5),
        empEmail: faker.internet.email()
    }
};

//Execute
const employee = generateEmployeeData();

console.log(employee.firstName);
console.log(employee.lastName);
console.log(employee.employeeId);
console.log(employee.empEmail);
