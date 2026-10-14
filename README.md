# charity: water – Water Quest Game Starter

In this game, users tap charity: water’s signature yellow jerry cans as fast as they can to earn points. You’ll be working from a partially built version of the game. Some functionality is already provided, and your job is to complete the rest.

## What’s Already Done

The starter files already include:

- A **heading and tagline**
- A **start button**
- A **game container** displaying a grid
- A **placeholder timer and score** (not functional yet)
- A **logo image** from charity: water
- Working code that:
  - Starts the game when the start button is clicked  
  - Makes jerry cans pop up randomly

## What You Need to Add

Here’s what you're required to implement to bring the game to life:

### Game Functionality

- **Update the score**
  - +1 point for each can clicked  

- **Add a 30-second timer**
  - When the timer reaches 0, the game ends  

- **Display a message when the game ends**
  - If the player scores **20 or more points**, show a **winning** message  
  - If the player scores **less than 20 points**, show a **"try again"** message  
  - Create one array of possible winning messages and one array of losing messages  
  - Depending on whether the user wins or loses, randomly pick and display a message from the appropriate array  

### Visual Styling

- **Add charity: water branding**
  
  - Use the provided logo  
  - Use the [charity: water brand guidelines](https://drive.google.com/file/d/1ct4zYRIwHAtxoNQoeaVwWYPdnruSC6sr/view) to stay on-brand with colors and styling
  - Add styling rules to ensure your game layout adjusts well across different screen sizes

These are the minimum requirements, but if you'd like an additional challenge go ahead and give the LevelUps a shot! For example, you could add logic to decrease the user's score if they miss a jerry can. Have fun and make the game your own!

If you have any questions or need any assistance with your code, reach out to the HelpHub or attend a Drop-In Hour. You got this!!


## Completed game

Collect yellow cans for **+1 point** each and avoid red × obstacles, which cost
**1 point** each (scores can go below zero). Each item can only be clicked once.
New items appear every 0.75 seconds. Reach **20 points in 30 seconds** to win.
The score updates immediately; scoring and spawning stop when time runs out.
The game picks a random message from separate winning and losing arrays and
shows a celebration for a win. Reset clears both timers and restores the initial
screen. You can also use Tab and Enter/Space to play.

## Preview in a Codespace

1. Run **Terminal → Run Task → Preview Water Quest**, or run
   `python3 -m http.server 8000` in the terminal.
2. Open the **Ports** panel, find port **8000**, and select **Open in Browser**.
3. To stop the preview server, press Ctrl+C in its terminal.

This project uses plain HTML, CSS, and JavaScript with relative asset paths and
no build step. For GitHub Pages, select the branch containing these files and
**/ (root)** in the repository's **Settings → Pages** deployment settings.

## Validation

Browser checks used a controlled clock to verify the full 30-second round:

- Clicking a can twice adds only 1 point; clicking an obstacle twice subtracts only 1.
- The countdown updates, repeated starts do not restart it, and expiration clears the board.
- A final score of 19 loses; 20 wins and shows the celebration.
- Scores stay unchanged after expiration.
- Reset during play stops spawning/countdown and restores score 0 and time 30.
- Reset after a win removes the celebration; a new round works normally.
- Enter activates a focused can button.
- At 320px, 390px, and 1440px widths, there is no horizontal overflow,
  images load, and all buttons are at least 44 × 44 CSS pixels.

JavaScript syntax checking and editor diagnostics also passed.
