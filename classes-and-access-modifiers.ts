// classes-and-access-modifiers.ts
// Topic 4: Classes, constructors, and access modifiers
// public = can be used anywhere.
// private = can be used only inside the class.
// protected = can be used inside the class and child classes.

class Student {
    public name: string;
    private marks: number;
    protected grade: string;

    constructor(name: string, marks: number, grade: string) {
        this.name = name;
        this.marks = marks;
        this.grade = grade;
    }

    public showName(): string {
        return this.name;
    }

    public showMarks(): number {
        return this.marks;
    }

    protected showGrade(): string {
        return this.grade;
    }
}

class TopStudent extends Student {
    public displayGrade(): string {
        return this.showGrade();
    }
}

const student = new Student("Asha", 90, "A");
const top = new TopStudent("Ravi", 95, "A+");

console.log(student.showName());
console.log(student.showMarks());
console.log(top.displayGrade());
