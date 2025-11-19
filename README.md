# Delta Kanban

My first fullstack project built with React, TypeScript, Tailwind, TanStack Query, DnD_Kit, Node.js and Express.js. I built this project in an ambitious attempt to make my first step towards becoming a fullstack developer more "challenging". What a mistake that was...
The kanban is meant to be used as an organising board composed of columns and todo cards. Each column and card can be dragged and dropped within the parent container, as well as cross-column in the case of the todo cards.

## Technologies
- React
- TypeScript
- JavaScript
- Tailwind
- DnD-Kit
- MongoDB
- TanStack Query
- Node.js/Express.js

## Features
- Create, Edit, Delete, Drag and Drop columns and todo cards
- Mark Todo Cards as done, edit their content with formatting, or delete them altogether
- Add custom labels to todo cards

## The Process
I learned about DnD-Kit from my classmate who based his thesis on the tool. I then researched its usage and settled on creating the kanban as my first fullstack project.

Building the backend had its ups and downs. The biggest challenge was setting up various parts of the project and making them coexist. I am not ashamed to admit debugging the setup must have taken me about as much time as it did building the actual backend. Still, being familiar with JavaScript and understanding RESTful API's helped speed up the task tremendously. It also reminded me of the importance of proper planning, as I caught myself backtracking to add one more thing to my controllers or models on several occasions.

Once I had built the backend I then built the bare bones of my frontend. The drag and drop logic turned out to be particularly difficult, for all documentation of DnD-Kit resolves around stateful events. I, on the other hand, was using an API, which made the task that much more difficult. Still, after some trial and error I got it up and running.

## What I learned

I got to learn how an API is built and what blocks it consists of. After some brief research in my spare time I realized that regardless of the used language the basics are pretty much the same. This gave me more confidence to explore other languages in the future.

Working on this project was a great opportunity to stop relying on state as much as I used to. Like most student and junior frontend developers I suffered from the wall of state disease. While there's still state usage throughout this project (and perhaps still happening too often) I consider it to be kept short and necessary. TanStack Query helped with this task tremendously, too.

This project was also my first real exposure to making the website accessible in accordance to WCAG guidelines. While there's still room for improvement, partially due problems with my hardware that rendered testing more difficult, I think of it as a good first step towards the new norm that is undeniable accessibility.

## Running The Project

To test Delta Kanban head to https://fullstack-kanban-delta.vercel.app/ and make an account, or login with the following credentials:

username: anders
password: kaffe456

## Video Showcase
- tbc
