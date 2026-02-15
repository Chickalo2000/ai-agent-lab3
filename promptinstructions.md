
JavaScript Best Practices & Coding Style Guide
This guide defines the preferred patterns, conventions, and coding style for writing clean, maintainable, and scalable JavaScript. It applies to all JavaScript used across the project—frontend, backend, and shared modules.

✨ Core Principles
- Readability over cleverness
Code should be easy to understand at a glance.
- Consistency over preference
Follow the style guide even if you personally prefer another style.
- Predictability over magic
Avoid surprising behavior, hidden side effects, or implicit assumptions.
- Simplicity over complexity
Prefer the simplest solution that solves the problem well.

📁 Project Structure
- Group related files by feature, not by type (recommended for modern apps).
- Keep modules small and focused.
- Use clear, descriptive file names:
- userController.js
- authService.js
- formatDate.js

🧱 Variables & Constants
Use const by default
const MAX_RETRIES = 3;


Use let only when reassignment is required
let counter = 0;
counter++;


Never use var
It introduces function-scoped behavior and hoisting issues.
Use descriptive names
const userId = 42;       // good
const x = 42;            // avoid



🔤 Strings
- Prefer template literals over string concatenation.
const message = `Hello, ${user.name}!`;



🧮 Functions
Prefer arrow functions for most cases
const getUser = (id) => { ... };


Use named functions when clarity matters
function validateEmail(email) { ... }


Keep functions small and single-purpose
If a function does more than one thing, split it.

📦 Objects & Arrays
Use object shorthand
const name = "Jessica";
const user = { name }; // instead of { name: name }


Use destructuring
const { id, email } = user;
const [first, second] = items;


Avoid mutating objects/arrays unless necessary
Prefer immutable patterns:
const updated = { ...user, active: true };



🔁 Loops & Iteration
Prefer modern iteration methods:
- map
- filter
- reduce
- for...of
Avoid traditional for loops unless performance-critical.

🧪 Conditionals
Use strict equality
if (value === 0) { ... }


Use early returns to reduce nesting
if (!user) return null;


Prefer ternaries for simple expressions
const status = isActive ? "active" : "inactive";



🧹 Error Handling
Always handle errors in async code
try {
  const data = await fetchData();
} catch (err) {
  console.error(err);
}


Avoid silent failures
Log or surface errors meaningfully.

📚 Modules
Use ES Modules (import / export)
import { getUser } from "./userService.js";
export const formatName = (name) => ...


Keep exports minimal and intentional
Prefer named exports over default exports.

🧼 Code Style
Indentation
- Use 2 spaces (no tabs).
Semicolons
- Required at the end of statements.
Quotes
- Use single quotes for strings.
- Use backticks for template literals.
Spacing
- One space after keywords:
if (condition) { ... }
- One space around operators:
const total = price * quantity;


Line Length
- Max 100 characters per line.

🧭 Naming Conventions
|  |  |  | 
|  |  | userName | 
|  |  | getUserData() | 
|  |  | UserService | 
|  |  | MAX_RETRIES | 
|  |  | user-service.js | 



⚙️ Async & Promises
Prefer async/await over .then() chains
const data = await fetchData();


Always return promises in functions that use them
return fetch(url);



🧪 Testing Best Practices
- Write tests for:
- business logic
- utilities
- edge cases
- Use descriptive test names.
- Keep tests isolated and deterministic.

🧯 Security Best Practices
- Never expose API keys in frontend code.
- Validate all user input.
- Escape or sanitize dynamic content.
- Avoid eval() and similar dynamic execution.

🧰 Tooling & Linting
- Use ESLint with a standard config (Airbnb, Standard, or custom).
- Use Prettier for formatting.
- Run linters before committing.

📝 Documentation
- Document complex functions with JSDoc.
- Write clear comments explaining why, not what.
- Keep README and architecture docs updated.

If you want, I can also generate:
- A matching CSS Best Practices section
- A Frontend + Backend JS Architecture Guide
- A Team Coding Standards Checklist
- A Linting + Prettier config ready to paste into your project
Just tell me what direction you want to take next.
