# charity: water – Water Quest

Water Quest is an interactive, fast-paced web game inspired by **charity: water**’s mission to bring clean and safe drinking water to people around the world. In this game, players tap charity: water’s signature yellow jerry cans to collect water points while avoiding red obstacles.

---

## Features & Gameplay

### 1. Meaningful Difficulty Modes
Players can choose their challenge level before starting a round. The selected rules, time limit, and target score are displayed prominently:
- **Easy Mode**: Collect **15 points** in **40 seconds** (relaxed spawn pace for beginners).
- **Normal Mode**: Collect **20 points** in **30 seconds** (balanced default challenge).
- **Hard Mode**: Collect **25 points** in **25 seconds** (fast spawn rate for seasoned players).

*Difficulty selection is locked during an active round to prevent changing rules mid-game and unlocks upon reset or completion.*

### 2. Reliable Interactive Gameplay
- **Immediate DOM feedback**: When a yellow jerry can or obstacle is clicked, it vanishes instantly and updates the score without delay.
- **Single-count guarantee**: Each item is consumed immediately upon interaction, ensuring double-clicks or repeated taps cannot register more than once.
- **Scoring**:
  - Yellow Jerry Can: **+1 point**
  - Red Obstacle (×): **−1 point** (scores can dip below zero)
- **Time cutoff**: Scoring stops strictly when time runs out.

### 3. Milestone Announcements
In-game status updates motivate players as they progress toward their target score. Milestones are evaluated using an array of motivational messages paired with conditional logic:
- **Halfway Milestone**: Reaching 50% of the target goal (e.g., 8 on Easy, 10 on Normal, 13 on Hard).
- **Goal Reached**: Achieving or surpassing the required goal before time expires.
- **End-of-Game Outcome**: Randomized victory celebrations or encouraging try-again messages selected from winning and losing arrays.

### 4. Sound Effects & Mute Control
- **Water Drop Collect Sound (`audio/collect.wav`)**: Cheerful upward droplet bloop when collecting a can.
- **Victory Chime (`audio/win.wav`)**: Triumphant ascending fanfare upon reaching the goal.
- **Mute Toggle**: A dedicated button (`🔊 Sound: ON` / `🔇 Sound: OFF`) lets players mute or unmute audio at any time.
- **Audio Policy Compliant**: Audio never autoplays before user interaction.
- **Audio Licensing & Attribution**: Procedurally synthesized under the **Creative Commons Zero (CC0 1.0 Universal) Public Domain Dedication**. Source script provided in `scripts/generate_audio.py` and documented in `audio/LICENSE.txt`.

### 5. charity: water Brand Design & Typography
- Styled using charity: water brand guidelines:
  - **Water Can Yellow**: `#ffc907`
  - **Charity Deep Blue**: `#163c4a`
  - **Clean Slate Background**: `#edf6f7`
- Typography uses **Montserrat** (Google Fonts) paired with **Proxima Nova** system fallbacks to replicate charity: water's signature geometric aesthetic.
- Fully responsive across mobile (320px, 390px, 480px) and desktop screens with minimum 44×44px accessible touch targets and keyboard accessibility (Tab navigation + Enter/Space to collect).

### 6. Visible charity: water Footer
A persistent, high-contrast footer provides direct links to charity: water’s official websites:
- [Learn about charity: water](https://www.charitywater.org/)
- [Donate to charity: water](https://www.charitywater.org/donate)

---

## Preview in a Codespace

1. Run the preview task or start Python's built-in HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
2. Open the **Ports** panel, locate port **8000**, and select **Open in Browser** (or navigate to `http://localhost:8000`).
3. Press `Ctrl+C` in the terminal when you wish to stop the server.

---

## Verification & Testing

The implementation has been verified for:
- **Difficulty Modes**: Correct goals and timers for Easy (15 pts / 40s), Normal (20 pts / 30s), and Hard (25 pts / 25s). Dropdown disables during active play and re-enables on reset.
- **Scoring & Obstacles**: Reliable immediate DOM removal on click; no duplicate points on multi-click.
- **Timer Management**: Timers clear cleanly on Reset; repeated clicks on Start do not generate multiple timers; scoring halts immediately upon expiration.
- **Outcomes**: Winning celebration and victory chime trigger at or above goal; try-again messages trigger below goal.
- **Milestones**: Status updates at 50% and 100% goal completion.
- **Audio & Mute**: Sounds play on collection and victory; mute button silences audio; no autoplay on page load.
- **Footer Links**: Working external links to `charitywater.org` and `charitywater.org/donate`.
- **Responsive Layout**: Validated across small screens (320px–480px) and wide desktop viewports without overflow.
