// 1. ARROW FUNCTION

const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

console.log(greet("Amanjeeta"));

// 2. OBJECT DESTRUCTURING

const student = {
  name: "Amanjeeta",
  age: 20,
  course: "B.Tech CSE",
};

const { name, age, course } = student;

console.log(name);
console.log(age);
console.log(course);

// 3. SPREAD OPERATOR ON ARRAY

const skills = ["JavaScript", "React"];

const updatedSkills = [...skills, "React Native", "TypeScript"];

console.log(updatedSkills);

// 4. MAP

const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((num) => num * 2);

console.log("Doubled:", doubled);

// 5. FILTER

const evenNumbers = numbers.filter((num) => num % 2 === 0);

console.log("Even:", evenNumbers);

// 6. ASYNC FUNCTION WITH FETCH

const fetchUser = async (): Promise<void> => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
    );

    const data = await response.json();

    console.log("Fetched User:", data);
  } catch (error) {
    console.log("Error fetching user:", error);
  }
};

fetchUser();

// 7. TYPESCRIPT INTERFACE

interface User {
  name: string;
  age: number;
}

// 8. FUNCTION THAT ACCEPTS USER

const displayUser = (user: User): void => {
  console.log("User Name:", user.name);
  console.log("User Age:", user.age);
};

const newUser: User = {
  name: "Amanjeeta",
  age: 20,
};

displayUser(newUser);
