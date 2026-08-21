// interfaces-vs-type-aliases.ts
// Topic 2: Interfaces vs Type Aliases
// Interface = a simple way to describe an object.
// Type alias = another way to give a name to a type.

interface StudentInfo {
    name: string;
    age: number;
}

const student1: StudentInfo = {
    name: "Asha",
    age: 21
};

console.log(student1);

type CourseName = string;

const course: CourseName = "TypeScript";
console.log(course);

type Status = "PASS" | "FAIL";

const result: Status = "PASS";
console.log(result);
