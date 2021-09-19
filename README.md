# Flashcards Frontend

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

## About this project

This is the frontend for the flashcards application, the API used for storing and providing data is at this other [repository](https://github.com/gabrielnakaema/flashcards-api)

This is still a work in progress

This project's goal is to create an application where users can create and store decks of flashcards that can assist them in learning through spaced repetition methods.

Here are some screenshots of the current state of the application:

<p float="middle">

  <img src="https://user-images.githubusercontent.com/61115384/133946945-cfb17a42-b4c5-4d41-9361-9fbc4415bed2.png" alt="flashcards-1" width="40%"/>

  <img src="https://user-images.githubusercontent.com/61115384/133946948-933bf272-e4ef-46a6-8144-aa8dd86cc72a.png" alt="flashcards-2" width="40%"/>
  
  <img src="https://user-images.githubusercontent.com/61115384/133946950-dd547292-827e-4ad0-b522-b6b5ff952694.png" alt="flashcards-3" width="40%"/>
  
  <img src="https://user-images.githubusercontent.com/61115384/133946951-acd0219b-4b91-438f-b32c-b84ae06a5205.png" alt="flashcards-4" width="40%"/>

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
