import './styles.css';
import "./cell.js";
import Cell from './cell.js';
import Piece from './piece.js';
import React, {MouseEvent, useEffect, useRef, useState} from 'react';

let initialPieces = [];
let numId = 1;

let pieceElement = null;
let selectedPiece = null;
let possibleMoves = [];
let possibleCaptu = [];
let canCapture = false;
let captureAgain = false;

let turn = "red";

let redDead = 0;
let blackDead = 0;
let end = false;


for (let i = 0; i < 8; i++){
    for (let j = 0; j < 8; j++){
        
        if ((i < 3) && ((i+j)%2 === 1)){
            initialPieces.push(new Piece(numId, "black", "normal", "active",  i, j, false));
            numId += 1;
        }

        if ((i > 4) && ((i+j)%2 === 1)){
            initialPieces.push(new Piece(numId, "red", "normal", "active", i, j, false));
            numId += 1;
        }
    }
}

function Board(){
    let board = [];

    const [pieces, setPiece] = useState(initialPieces);

    function isTherePiece(position) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].row === position[0]
                && pieces[i].col === position[1]){
                return true;
            }
        }
        return false;
    }

    function isThereEnemy(position, p) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].row === position[0]
                && pieces[i].col === position[1]
                && pieces[i].color !== p.color ){
                return true;
            }
        }
        return false;
    }

    function underLimit(position) {
        if ( (position[0] < 0 || position[0] >= 8) 
            || (position[1] < 0 || position[1] >= 8) ) {
            return false;
        }
        return true;
    }

    function checkValidCells(position) {
        return !(isTherePiece(position)) && underLimit(position);
    }
 
    function checkMove(currentRow, currentCol) {
        if (!canCapture){
            if (pieces[selectedPiece].type === "normal") {
                if (pieces[selectedPiece].color === "red") {
                    if( checkValidCells([currentRow-1, currentCol-1])) {
                        possibleMoves.push([currentRow-1, currentCol-1]);
                    }
                    if( checkValidCells([currentRow-1, currentCol+1])) {
                        possibleMoves.push([currentRow-1, currentCol+1]);
                    }
                }
                else if (pieces[selectedPiece].color === "black") {
                    if( checkValidCells([currentRow+1, currentCol+1])) {
                        possibleMoves.push([currentRow+1, currentCol+1]);
                    }
                    if( checkValidCells([currentRow+1, currentCol-1])) {
                        possibleMoves.push([currentRow+1, currentCol-1]);
                    }
                }
            }
            else {
                let signal = [1, -1];
                for (let i = 0; i < 2;  i++) {
                    for (let j = 0; j < 2; j++) {
                        let valid = true;
                        let k = 1;
                        while (valid) {
                            if ( checkValidCells([(currentRow+signal[i]*k), (currentCol+signal[j]*k)])) {
                                possibleMoves.push([(currentRow+signal[i]*k), (currentCol+signal[j]*k)]);
                            }
                            else {valid = false;}
                            k++;
                        }
                    }
                }
                
            
            }
        }
    }

    function checkCapture(row, col, p) {
        if (p.type === "normal") {
            if(isThereEnemy([row+1, col+1], p) && checkValidCells([row+2, col+2])){
                    possibleCaptu.push([row+2, col+2]);
                    canCapture = true;
            }
            if(isThereEnemy([row+1, col-1], p) && checkValidCells([row+2, col-2])){
                    possibleCaptu.push([row+2, col-2]);
                    canCapture = true;
            }
            if(isThereEnemy([row-1, col-1], p) && checkValidCells([row-2, col-2])){
                    possibleCaptu.push([row-2, col-2]);
                    canCapture = true;
            }
            if(isThereEnemy([row-1, col+1], p) && checkValidCells([row-2, col+2])){
                    possibleCaptu.push([row-2, col+2]);
                    canCapture = true;
            }
        }

        else {
            let signal = [1, -1];
            for (let i = 0; i < 2;  i++) {
                for (let j = 0; j < 2; j++) {
                    let valid = true;
                    let k = 1;
                    while (checkValidCells([(row+signal[i]*k), (col+signal[j]*k)])) {
                        k++;
                    }
                    
                    if ( isThereEnemy([(row+signal[i]*k), (col+signal[j]*k)], p)) {
                        if (checkValidCells([(row+signal[i]*(k+1)), (col+signal[j]*(k+1))])) {
                            possibleCaptu.push([(row+signal[i]*(k+1)), (col+signal[j]*(k+1))]);
                            canCapture = true;
                        }
                    }
                    
                }
            }
        }
    }

    function displayMoves() {
            for (let i = 0; i < possibleCaptu.length; i++) {
                let cellElement = document.getElementById(`${possibleCaptu[i]}`);
                cellElement.style.background = "green";
            }
            for (let i = 0; i < possibleMoves.length; i++) {
                let cellElement = document.getElementById(`${possibleMoves[i]}`);
                cellElement.style.background = "purple";
            }
        
    }

    function selectPiece(e: React.MouseEvent) {
        const element = e.target;
            
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].row === parseInt(element.id[5])
                    && pieces[i].col === parseInt(element.id[7])){
                    selectedPiece = i;
                }
            }

        if (turn === pieces[selectedPiece].color) {
            
            element.style.background = "purple";

            pieceElement = element;

                
            checkCapture(pieces[selectedPiece].row, pieces[selectedPiece].col, pieces[selectedPiece]);

            checkMove(pieces[selectedPiece].row, pieces[selectedPiece].col);

            displayMoves();

            console.log(pieces[selectedPiece]);
        }
        else {
            selectedPiece = null;
        }
    }

    function upgrade(piece) {
        setPiece (value => {
            const pieces = value.map((p) => {
                if (p === piece) {
                    p.type = "King";
                }
                return p;
            })
            return pieces;
        })
    }


    function capture(e: React.MouseEvent) {
        const element = e.target;
        const currentRow = pieces[selectedPiece].row;
        const currentCol = pieces[selectedPiece].col;
        const nextRow = parseInt(element.id[0]);
        const nextCol = parseInt(element.id[2]);
        let deadRow = 0;
        let deadCol = 0;

        if (pieces[selectedPiece].color === "red") {
            blackDead ++;
        }
        else {
            redDead ++;
        }

        if (nextRow > currentRow) {
            if (nextCol > currentCol) {
                deadRow = nextRow - 1;
                deadCol = nextCol - 1;
            }
            else {
                deadRow = nextRow - 1;
                deadCol = nextCol + 1;
            }
        }
        else {
            if (nextCol > currentCol) {
                deadRow = nextRow + 1;
                deadCol = nextCol - 1;
            }
            else {
                deadRow = nextRow + 1;
                deadCol = nextCol + 1;
            }
        }

        setPiece (value => {
            const pieces = value.map((p) => {
                if (p.row === currentRow && p.col === currentCol) {
                    p.row = nextRow;
                    p.col = nextCol;
                }
                if (p.row === deadRow && p.col === deadCol) {
                    p.row = -10;
                    p.col = -10;
                    p.state = "deactivated";
                }
                return p;
            })
            return pieces;
        });

        clearMoves();

        canCapture = false;

        checkCapture(nextRow, nextCol, pieces[selectedPiece]);
        captureAgain = canCapture;
        if (captureAgain) {
            pieceElement.style.background = "purple";
            displayMoves();
        }
        else {
            if (pieces[selectedPiece].color === "red" && pieces[selectedPiece].type === "normal" && redDead > 0) {
                if (nextRow === 0) {
                    upgrade(pieces[selectedPiece]);
                    redDead--;
                }
            }
            else if (pieces[selectedPiece].color === "black" && pieces[selectedPiece].type === "normal" && blackDead > 0) {
                if (nextRow === 7) {
                    upgrade(pieces[selectedPiece]);
                    blackDead--;
                }
            }
            deselect();
            nextTurn(turn);
        }
        
    }

    function movePiece(e: React.MouseEvent) {
        const element = e.target;
        const currentRow = pieces[selectedPiece].row;
        const currentCol = pieces[selectedPiece].col;
        const nextRow = parseInt(element.id[0]);
        const nextCol = parseInt(element.id[2]);

        setPiece (value => {
            const pieces = value.map((p) => {
                if (p.row === currentRow && p.col === currentCol) {
                    p.row = nextRow;
                    p.col = nextCol;
                }
                return p;
            })
            return pieces;
        });

        if (pieces[selectedPiece].color === "red" && pieces[selectedPiece].type === "normal" && redDead > 0) {
            if (nextRow === 0) {
                upgrade(pieces[selectedPiece]);
                redDead--;
            }
        }
        else if (pieces[selectedPiece].color === "black" && pieces[selectedPiece].type === "normal" && blackDead > 0) {
            if (nextRow === 7) {
                upgrade(pieces[selectedPiece]);
                blackDead--;
            }
        }

        deselect();
        nextTurn(turn);
    } 

    function nextTurn() {
        if (turn === "red") {
            turn= "black";
        }
        else {
            turn = "red";
        }
    }

    function itsPossible(e: React.MouseEvent) {
        for (let i = 0; i < possibleCaptu.length; i++) {
            if (e.target.id === `${possibleCaptu[i]}`) {
                return 2;
            }
        }
        for (let i = 0; i < possibleMoves.length; i++) {
            if (e.target.id === `${possibleMoves[i]}`) {
                return 1;
            }
        }
        return 0;
    }

    function clearMoves() {
        for (let i = 0; i < possibleMoves.length; i++) {
            let cellElement = document.getElementById(`${possibleMoves[i]}`);
            cellElement.style.background = null;
            
        }

        for (let i = 0; i < possibleCaptu.length; i++) {
            let cellElement = document.getElementById(`${possibleCaptu[i]}`);
            cellElement.style.background = null;
            
        }
        
        possibleMoves = [];
        possibleCaptu = [];
    }


    function deselect(e: React.MouseEvent) {
        pieceElement.style.background = "rgba(0,0,0,0)";
        clearMoves();
        selectedPiece = null;
    }

    function methods(e: React.MouseEvent ) {
        console.log(end);
        console.log(winner);
        if (selectedPiece === null) {
            if(e.target.classList.contains("piece") && !captureAgain) {
                selectPiece(e);
            }
        }
        else{
            if (itsPossible(e) === 2) {
                capture(e);
            }
            else if (itsPossible(e) === 1 && !captureAgain) {
                movePiece(e);
            }
            else if (!captureAgain){
                deselect();
            }
        }
    }

    function checkEnd() {
        let countRed = 0;
        let countBlack = 0;
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].state === "deactivated") {
                if (pieces[i].color === "red") {
                    countRed += 1;
                }
                else {
                    countBlack += 1;
                }
            }
        }
        if (countRed === 12) {
            return "Black";
        }
        else if (countBlack === 12) {
            return "Red";
        }
        else {
            return null;
        }
    }

    
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            let position = [i, j];
            let image = undefined;
            for (let k = 0; k < pieces.length; k++) {
                if (pieces[k].state === "active" && pieces[k].row === i && pieces[k].col === j){
                    if(pieces[k].type === "normal") {
                        image = `./images/${pieces[k].color}.png`;
                    }
                    else{
                        image = `./images/${pieces[k].color}${pieces[k].type}.png`;
                    }
                }
            }

            board.push(<Cell image={image} position = {position}></Cell>);
        }
    }

    let winner = checkEnd();
    if (winner !== null) {
        let winnerElement = document.getElementById("winner");
        winnerElement.style.visibility = "visible";
    }
    

    return <div className = "interface">
            <div className = "dead"> 
                {redDead} x
            </div>
            <div id = "board" onMouseDown = {e => methods(e)}>
                {board}
            </div>
            <div className = "dead">
                {blackDead} x
            </div>
            <div id="turn"> {turn}´s turn</div>
            <div id="winner"> {winner} is the winner!!!</div>
        </div>
}

export default Board;