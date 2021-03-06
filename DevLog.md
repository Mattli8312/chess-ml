# List of Objectives

- **Complete GameLogic**
    - [x] **Pawns**
        - [x]: Move in right direction
        - [x]: Move 2 times if on starting position
        - [x]: Capture Enemy Pieces
        - [x]: Promoting piece
        - [x]: En Pasant
    - [x] **Rooks**
        - [x]: Capture  
        - [x]: Movements 
        - [x]: Castling
    - [x] **Knights**
        - [x]: Capture 
        - [x]: Movements
    - [x] **Bishop**
        - [x]: Capture 
        - [x]: Movements
    - [x] **Queen**
        - [x]: Capture 
        - [x]: Movements
    - [x] **King**
        - [x]: Capture 
        - [x]: Movements
        - [x]: Castling
        - [x]: Check/Mate
            - [x]: Blocks
            - [x]: Moving
            - [x]: Pins
- **Work on webserver and Socket implementation**
    - [x] Get right dependencies
    - [x] Implement game rooms and state machine
        - [x]: change game mode
        - [x]: Disconnect from a game
        - [x]: Room capacity restrictions
    - [x] Proper data transfer between clients in room
        - [x]: clock data
        - [x]: turn data
        - [x]: Movement data
            -[x]: Move Notation
            -[x]: Physical Movement/Update of Pieces
            -[x]: En Pasant
            -[x]: Promotion
            -[x]: Castle
        - [x]: Win data
        - [x]: Rematch data
    - [] Deploy on Heroku and Github
- **Chess Engine** (Save for later)
    - [] Implement Minimax algorithm
    - [] Run TestCases and optimize using alpha beta pruning