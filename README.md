# ShakesPeer

*ShakesPeer* is an open-source, interactive tool that visualizes character-to-character relationships in Shakespearean 
literature. It supports in-depth analysis of sentiment dynamics between characters, allowing users to identify influential 
moments in the narrative as well as a character’s friends and enemies at different points in the story. *ShakesPeer*
provides two main views: (1) the *Character Overview*, which spatially maps out the connections between every character 
in a play, and (2) the *Character-Pair view*, which provides detailed information about the development and flux of 
sentiment between each pair of characters over the course of the story. 

## Code Overview:

**In the root directory:**

`app.js` is the main entry point for the Node.js back-end, which serves the front-end files statically. 

The code for the Angular front-end, and the bulk of the project, is in `angular-src/shakespeer/`.

---

**In `angular-src/shakespeer/src/app`:**

There are three folders: `components`, `models`, and `services`. 
- The `components` directory stores all of th``e Angular components, each organized in their own folder: 
    - `header`: The header component, which renders the dark gray header at the top. Doesn't do much right now.
    - `main`: Responsible for arranging each of the three main components (`network`, `relationship`, `sidebar`) into
    Bootstrap's grid layout.
    - `network`: The component that implements the *Character Overview*.
    - `relationship`: The component that implements the *Character-Pair view*.
    - `sidebar`: The component that implements the *Sidebar*. 
- The `models` directory has `filter.model.ts`, which stores the state information shared across all components, such as
the selected/hovered characters or filter options.
- The `services` directory has `filter.service.ts`, which is responsible for making sure all components have access to 
the shared state information through RxJS's Observer Design pattern. 

## Installation:
1. Make sure you have node, [Angular CLI](https://cli.angular.io/), and npm installed. 
2. Make sure all node packages are installed by running `npm install` in both the root directory 
as well as under `angular-src/shakespeer/`. 
3. Under `angular-src/shakespeer/`, run `npm build` to build the front-end files, which will create
a folder named `dist` in the same directory.
4. Back in the root directory, run `node app.js` to start the express server.
5. Navigate to `http://localhost:3000/` to access the website. 

## Development:
- If you're just working on the front-end (Angular), you can run `ng serve` to load a dev server 
that will automatically reload the front-end when changes are made. Navigate to 
`http://localhost:4200/` to access the website. 
