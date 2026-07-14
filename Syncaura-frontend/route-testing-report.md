# Route Testing Report

## Tester

Debasish Mohapatra

## Date

25 June 2026

## Project

Syncaura Frontend

---

## Test Environment

* Frontend running successfully on localhost.
* Backend server starts but could not connect to PostgreSQL due to a database authentication issue.
* Browser: Google Chrome

---

## Features Tested

| Feature             | Expected Result           | Actual Result             | Status   
| --------------------|-------------------------- |---------------------------|---------  
| Home Page.          | Page loads successfully.  | Loaded successfully.      | ✅ Pass. 
|                     |                           |                           |
| Navigation Bar.     |All navigation links should| All navigation links work | ✅ Pass.
|                     |work.                      |correctly.                 |              
| Footer.             | Footer should display     |Displayed correctly.       | ✅ Pass.
|                     | correctly.                |                           |
| Get Started Button. | Should navigate to the    | No action when clicked.   | ❌ Fail.
|                     |intended page.             |                           |
| Login Button.       | Should open the login page| No action when clicked.   | ❌ Fail.
| Start Button.       | Should start the intended | No action when clicked.   | ❌ Fail.
|                     | workflow.                 |                           |
| Learn More Button.  | Should navigate to more   | No action when clicked.   | ❌ Fail.    |                     | information.              |                           |
| Email Validation.   | Invalid email should show | Validation message        | ✅ Pass.
|                     | an error.                 | displayed.                |             
| Empty Email         | Empty email should show a | Validation message        | ✅ Pass. 
| validation.         | required field error.     | displayed.                |                     
---

## Edge Cases Tested

### Invalid Email

* Entered an invalid email address.
* Validation message displayed correctly.
* **Status:** ✅ Pass

### Empty Email

* Left the email field empty and clicked **Subscribe**.
* Required field validation message displayed correctly.
* **Status:** ✅ Pass

---

## Bugs Found

1. **Get Started button** is not functioning.
2. **Login button** is not functioning.
3. **Start button** is not functioning.
4. **Learn More button** is not functioning.

---

## Limitations

Backend-dependent features could not be fully tested because the backend could not connect to the PostgreSQL database due to a database authentication issue.

---

## Overall Result

The frontend application is stable and loads successfully. Navigation, layout, and client-side validation work correctly. The main issues identified are several non-functional action buttons. Backend-dependent functionality requires a working PostgreSQL connection before it can be fully verified.

