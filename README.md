# Flashcards Frontend

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

## About this project

This is the frontend for the flashcards application, the API used for storing and providing data is at this other [repository](https://github.com/gabrielnakaema/flashcards-api)

This is still a work in progress

This project's goal is to create an application where users can create and store decks of flashcards that can assist them in learning through spaced repetition methods.

Here are some screenshots of the current state of the application:

<p float="middle">

  <img src="https://user-images.githubusercontent.com/61115384/133927697-855f9cf4-1845-4a58-a23b-e982e435c125.png" alt="flashcards-1" width="40%"/>

  <img src="https://user-images.githubusercontent.com/61115384/133927705-9d408709-6887-422b-b0b5-28c366a69b31.png" alt="flashcards-2" width="40%"/>
  
  <img src="https://user-images.githubusercontent.com/61115384/133927718-6ed49d0a-c6d9-4203-83c4-0c8a9bfcc5db.png" alt="flashcards-3" width="40%"/>
  
  <img src="https://user-images.githubusercontent.com/61115384/133927731-4d07f6d5-5e6d-4a1c-a185-ccc724bc6ac4.png" alt="flashcards-4" width="40%"/>

</p>

### Libraries used

- React 17
- TypeScript
- Axios
- Material UI
- Formik
- Yup

## Instructions

1. Clone this repository

   ```
   git clone https://github.com/gabrielnakaema/flashcards-front.git
   ```

1. Navigate to the created directory

   ```
   cd flashcards-front
   ```

1. Create .env file following .env.example file, setting the following environment variables:

   ```
   REACT_APP_API_URL={API_URL}
   ```

1. Install dependencies using `npm install` and start application in development mode using `npm run start`
