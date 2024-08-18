## Overview

This roadmap outlines the progress and future tasks for the development of this roguelike game. It is divided into several sections to keep track of what has been implemented and what still needs to be done.

## Legend

- [ ] ==In Progress==
- [x] Implemented
- [x] _Needs Improvement (!)_
- [ ] Planned

## Features

### Core Mechanics

- [x] Game Terminal
- [x] Screen Handler
- [x] Game Builder
- [x] Procedural Dungeon Generation
- [x] Turn-based Movement System
- [x] Melee Combat System
- [x] _Healing (!)_
- [x] _Inventory System (!)_
- [x] _Equipment System (!)_
- [x] _Buff/Spell System (!)_
- [x] _Ranged Combat (!)_
- [ ] Save and Load Game
- [x] _Look System (!)_

### Player Character

- [x] Basic Player Stats (HP, attack, defense)
- [ ] Skills and Abilities

### Enemies

- [x] Basic Enemy AI
- [x] Progressively Stronger Enemies
- [x] _Enemy Variety (!)_
- [x] Enemy Abilities and Spells
- [ ] Boss(es)

### Items and Loot

- [x] Random Item Generation
- [x] _Consumable Items (!)_
- [ ] Weapon and Item Variety
- [x] Item Rarities
- [ ] Starting Equipment Selection
- [ ] Containers / Stashes

### Spells and Buffs

- [x] Negative Buff Spells
- [ ] Positive Buff Spells
- [x] _Spell Costs (!)_
- [x] Unified Player/Monster Spell System

### User Interface

- [x] Stats Display
- [x] Messages Display
- [x] Buffs Display
- [x] Equipment Display
- [x] Message Log
- [x] Situation Dependent Images
- [x] _Main Menu (!)_
- [ ] Help Screen

### World and Environment

- [x] Basic Dungeon Environment
- [x] (Horizontal) Digging Mechanic
- [ ] ==Diverse Biomes==
- [ ] Environmental Hazards (traps, poison)
- [x] _Generators for Different Map Types (Cave, Labyrinth, City, etc...) (!)_
- [ ] Static Maps for Story Purposes

### Sound and Music

- [ ] Background Music
- [ ] Ambient Sounds

### Narrative

- [ ] Main Storyline
- [ ] Side Quests
- [ ] In-game Lore (books, inscriptions)

### Advanced Mechanics

- [ ] Thirst-System
- [ ] Simple Crafting / Item Combination System

### Backend for multi-platform deployment

- [x] Tauri backend

## Milestones

- [ ] A playable and winnable game

## Download

- TBA

## Build the App

1. Install the prerequisites for Tauri according to the [Tauri official website](https://tauri.app/v1/guides/getting-started/prerequisites).

2. Clone the Repository

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

3. Install Node.js Dependencies

   ```bash
   npm install
   ```

4. Build the Tauri App

   4.1 For development (with hot-reloading):

   ```bash
   npm run tauri dev
   ```

   4.2 For production (to create a distributable package):

   ```bash
   npm run tauri build
   ```

   If using the dev command, the app will launch automatically. For production, the executable can be found in the src-tauri/target/release/ directory.

## Acknowledgements

This project is built upon the fundamental structure outlined in the book [_How to Create Your Own Roguelike with TypeScript_](https://www.google.com/search?client=firefox-b-d&q=how+to+make+your+own+roguelike%2C+gaardsted) by Jakob Gaardsted.

## Additional resources

[Adding new biome](adding_new_biome.md)
