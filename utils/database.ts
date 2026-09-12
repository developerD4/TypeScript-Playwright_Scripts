// Definition: Database utilities create the data required by a test and remove it afterward.
// Important: The actual database operation belongs in a reusable utility/helper, not in a test merely to demonstrate insert and delete. The source material's core concept is seed before the test and cleanup afterward.
export async function createTestEmployee(
    employeeName: string
) {

    console.log(
        `Creating employee: ${employeeName}`
    );

    // Real project:
    // INSERT INTO employees ...
}


export async function deleteTestEmployee(
    employeeName: string
) {

    console.log(
        `Deleting employee: ${employeeName}`
    );

    // Real project:
    // DELETE FROM employees ...
}