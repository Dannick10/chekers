const board = document.querySelector("canvas");
const ctx = board.getContext("2d");
const score = document.querySelector('.score')

const width = board.width, height = board.height;
const sizeGame = 8;
const unitsize = Math.min(width, height) / sizeGame;
let player = [];
let table = [];
let currentPlay = null;

const sizeTable = () => {
  for (let r = 0; r < sizeGame; r++) {
    for (let c = 0; c < sizeGame; c++) {
      table.push(
        {
          row: r,
          column: c, 
          style: (r + c) % 2
        }
      )

      makeplayers(r,c)
    }
  }
};

const scoreDraw = () => {

  const p1 = player.filter((p) => p.player == 1)
  const p2 = player.filter((p) => p.player == 2)

  score.innerHTML = `
  <div>
    <p>Player 1</p>
    <p>Peças: ${p1.length}</p>
  </div>
  <div>
    <p>Player 2</p>
    <p>Peças: ${p2.length}</p>
  </div>

  `
}

const makePlayer = (id, row, column, p) => {
  player.push({
    id,
    x: row,
    y: column,
    player: p,
  });
};

const drawTable = () => {
  console.log(table)
  table.map((t) => {
    ctx.fillStyle = t.style ? "black" : "white";
    ctx.fillRect(t.row * unitsize, t.column * unitsize, unitsize, unitsize);
  })

};

const makeplayers = (row,column) => {
  if (column < 2 && (row + column) % 2 === 1) {
    makePlayer(`${row}-${column}`, row, column, 1);
  }
  if (column >= sizeGame - 2 && (row + column) % 2 === 1) {
    makePlayer(`${row}-${column}`, row, column, 2);
  }
}

const drawPlayer = () => {
  scoreDraw()
  player.forEach((p) => {
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(
        image,
        p.x * unitsize + unitsize / 4,
        p.y * unitsize + unitsize / 4,
        unitsize / 2,
        unitsize / 2
      );
    };
    image.src = p.player === 1 ? "./images/circlep1.svg" : "./images/circlep2.svg";
  });
};

const getMousePosition = (event) => {
  const rect = board.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const row = Math.floor(x / unitsize);
  const column = Math.floor(y / unitsize);

  const clickedPlayer = player.find((p) => p.x === row && p.y === column);

  if (clickedPlayer) {
    console.log(`Você clicou no jogador ${clickedPlayer.id}`);
    currentPlay = clickedPlayer;
  } else if (currentPlay) {
    console.log("Movendo o jogador para a célula selecionada");
    movePlayer(currentPlay.id,row, column);
  } else {
    console.log("Nenhum jogador nesta célula");
  }
};
const movePlayer = (id, row, column) => {
  const playerToMove = player.find((p) => p.id == id);

  if (playerToMove) {
  
    const isNormalMove = Math.abs(playerToMove.x - row) === 1 && Math.abs(playerToMove.y - column) === 1;

    const isJumpMove = Math.abs(playerToMove.x - row) === 2 && Math.abs(playerToMove.y - column) === 2;

    const middleX = (playerToMove.x + row) / 2;
    const middleY = (playerToMove.y + column) / 2;
    
    const enemyInMiddle = player.find(
      (p) => p.x === middleX && p.y === middleY && p.player !== playerToMove.player
    );

    if (isNormalMove) {
      playerToMove.x = row;
      playerToMove.y = column;
      drawTable();
      drawPlayer();
      currentPlay = null;
    } else if (isJumpMove && enemyInMiddle) {
      playerToMove.x = row;
      playerToMove.y = column;
    
      player = player.filter((p) => !(p.x === middleX && p.y === middleY));

      drawTable();
      drawPlayer();
      currentPlay = null;
    } else {
      console.log("Movimento inválido");
    }
  } else {
    console.log("Jogador não encontrado");
  }
};

sizeTable();
drawTable();
drawPlayer();
board.addEventListener("click", getMousePosition);
