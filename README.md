# Jeopardy Generator
Whether for exam review or for pure entertainment, generate and share full functioning Jeopardy boards for all to enjoy.

## Working Prototype
You can access a working prototype of the React app here:https://jeopardy-generator.vercel.app/ and Node app here: https://guarded-woodland-98056.herokuapp.com/

## User Stories
This app is for two types of users: a visitor and a logged-in user

#### Landing Page
* as a visitor
* I want to understand what I can do with this app (or sign up, or log in)
* so I can decide if I want to use it

#### Login Page
* as a visitor
* I want to log into this application 
* so I can play the game

#### Registration Page
* as a visitor
* I want to register a secure account
* so I can play the game

#### Home Page
* as a user
* I want a place to create and store my boards
* so I can play and post them for others to use

#### Popular Boards Page
* as a user
* I want see the most popular boards uploaded
* so I can play them myself

#### Recent Page
* as a user
* I want to see all the boards that were recently posted
* so I can play them myself

#### Support Page
* as a user
* I want a place to report errors in the page
* so I can play and post them for others to use



### Wireframes
Landing/Login Page
:-------------------------:
![Landing/Login Page](/github-images/wireframes/login-page.png)
Landing/Register Page
![Landing/Register Page](/github-images/wireframes/registration-page.png)
Main Page
![Main Page](/github-images/wireframes/main-page.png)
Main Page/Gameboard
![Main Page/Gameboard](/github-images/wireframes/gameboard-layout.png)
Main Page/Question Submission
![Main Page/Question Submission](/github-images/wireframes/question-submission-page.png)
Main Page/Playboard
![Main Page/Playboard](/github-images/wireframes/gameboard-page.png)
Main Page/Question Shown
![Main Page/Question Shown](/github-images/wireframes/question-shown.png)
Support Page
![Support Page](/github-images/wireframes/support-page.png)

## Screenshots
Landing/Login Page
:-------------------------:
![Landing Page](/github-images/Screenshots/landing.png)
Landing/Register Page
![Register Page](/github-images/Screenshots/registration.png)

Main Page/Home
:-------------------------:
![Home Page](/github-images/Screenshots/Homepage.png)

Boards
:-------------------------:
![Boards/Editing](/github-images/Screenshots/editing.png)

![Boards/Game](/github-images/Screenshots/Play.png)

![Boards/Game/Question](/github-images/Screenshots/QuestionPage.png)

## Functionality
The app's functionality includes:
* Every User has the ability to create an account
* Every User has the ability to create fully functioning Jeopardy boards
* Every User has the ability to play a fully functiong Jeopardy board down to final Jeopardy
* Every User has the abilty to play other people's boards posted in both the Popular and Recent tabs


## Technology
* Front-End: HTML5, CSS3, JavaScript ES6, React
* Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, Postgres
* Development Environment: Heroku, DBeaver


## Front-end Structure - React Components Map
* __Index.js__ (stateless)
    * __App.js__ (stateful)
        * __LandingPage.js__ (stateful) - 
            * __LoginForm.js__ (stateful) -
            * __RegistrationForm.js__ (stateful) -
        * __Navbar.js__ (stateless) -
        * __Homepage.js__(stateless) -
            * __NewBoardButton.js__(stateful)
            * __BoardList.js__(stateless)
                * __Board.js__(stateless)
                * __BoardNav.js__(stateless)
            * __PlayBoard.js__(stateful) 
                * __PlayQuestion.js (stateful)
            * __CommunityBoards.js__(statless) -
                * __BoardList.js__(stateless)
                    * __Board.js__(stateless)
                    * __BoardNav.js__(stateless)
            * __Support.js__(stateless) -
                * __SupportForm.js__(stateful)


## Back-end Structure - Business Objects
* Users (database table)
    * id (auto-generated)
    * email (email validation)
    * username (at least 8 chars, special characters, alphanumerical)
    * password (at least 8 chars, at least one alpha and a special character validation)
* Boards
    * id (auto-generated)
    * user_id (auto-generated)
    * board_title (25 chars maximum, alphabetical)
    * times_played (integer, default 0)
    * date_created ( date-time )
    * date_updated ( date-time )
    * category_one (text)
    * category_two (text)
    * category_three (text)
    * category_four (text)
    * category_five (text)
    * category_six (text)
* CommunityBoards
    * id (auto-generated)
    * user_id (auto-generated)
    * board_title (25 chars maximum, alphabetical)
    * likes (integer, default 0)
    * date_created ( date-time )
    * category_one (text)
    * category_two (text)
    * category_three (text)
    * category_four (text)
    * category_five (text)
    * category_six (text)
* Questions
    * id (auto-generated)
    * board_id (auto-generated)
    * question_text (alphabetical, text)
    * question_answer (alphabetical, text)
    * question_points (numerical, default 100, enumeration: 100-500)
    * question_category (enumeration: 1-6 )
* Support
    * id (auto-generated)
    * user_id (auto-generated)
    * e-mail (text)
    * subject (text)
    * content (text)

## API Documentation
API Documentation details:
```text
    /api
    .
    ├── /auth
    │   └── POST
    │       ├── /login
    ├── /users
    │   └── POST
    │       └── /
    |__ /boards
    |   └──POST
    |       └── /questions
    |__/communityBoards
    |    └──POST
    |       └──/questions
    |__/Support
        └──POST
```        
## Responsive
App is built to be usable on mobile devices, as well as responsive across mobile, tablet, laptop, and desktop screen resolutions.

## Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* being able to update categories from edit board
* implementing double and final jeopardy
* aesthetic changes

## How to run it
Use command line to navigate into the project folder and run the following in terminal

### Local Node scripts
* To install the node project ===> npm install
* To migrate the database ===> npm run migrate -- 1
* To run Node server (on port 8000) ===> npm run dev
* To run tests ===> npm run test

### Local React scripts
* To install the react project ===> npm install
* To run react (on port 3000) ===> npm start
* To run tests ===> npm run test
