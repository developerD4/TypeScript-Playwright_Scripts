const testScore = 78;

if (testScore >= 90) {

    console.log('Test result: Excellent');

} else if (testScore >= 60) {

    console.log('Test result: Passed');

} else {

    console.log('Test result: Failed');

}
//Nested if
if (testScore > 60) {
    console.log("Test result: Good")
    if (testScore < 50) {
        console.log("Test result: Bad")
    }
}

let autoTestStage = 3;
let stageName;
switch (autoTestStage) {
    case 1:
        stageName = 'Setup';
        break;
    case 2:
        stageName = 'Execute';
        break;
    case 3:
        stageName = 'Verify';
        break;
    case 4:
        stageName = 'Report';
        break;
    case 5:
        stageName = 'Cleanup';
        break;
    default:
        stageName = 'Unknown stage';
}
console.log('Test stage', autoTestStage, 'is', stageName); // use Backtick for the output
console.log(`Test stage ${autoTestStage} is ${stageName}`);