import { useEffect, useState } from 'react'
import * as Trystero from 'trystero'
import _ from 'lodash'

type Board = {
  turn: number,
  grid: Array<number>,
}

type Move = {
  who: number,
  row: number,
  col: number,
}

const Board = {
  WIDTH : 8 as const,
  HEIGHT: 8 as const,

  new(): Board {
    const grid = new Array(8 * 8).fill(-1)
    grid[3 * Board.WIDTH + 3] = 0
    grid[3 * Board.WIDTH + 4] = 1
    grid[4 * Board.WIDTH + 3] = 1
    grid[4 * Board.WIDTH + 4] = 0
    return {
      turn: -1,
      grid
    }
  },

  play(board: Board, {who, row, col}: Move): Board {
    if ((board.turn & 1) !== who      )             return board
    if (row < 0 || row >= Board.HEIGHT)             return board
    if (col < 0 || col >= Board.WIDTH )             return board
    if (board.grid[row * Board.WIDTH + col] !== -1) return board

    const grid = [...board.grid]
    grid[row * Board.WIDTH + col] = who

    let i, j;

    // check the row to the west of the play
    j = col - 1
    while (j >= 0 && grid[row * Board.WIDTH + j] === 1-who) {
      j --
    }
    if (j >= 0 && grid[row * Board.WIDTH + j] === who) {
      j ++
      while (j < col) {
        grid[row * Board.WIDTH + j] = who
        j ++
      }
    }

    // check the row to the east of the play
    j = col + 1
    while (j < Board.WIDTH && grid[row * Board.WIDTH + j] === 1-who) {
      j ++
    }
    if (j < Board.WIDTH && grid[row * Board.WIDTH + j] === who) {
      j --
      while (j > col) {
        grid[row * Board.WIDTH + j] = who
        j --
      }
    }

    // check the row to the north of the play
    i = row - 1
    while (i >= 0 && grid[i * Board.WIDTH + col] === 1-who) {
      i --
    }
    if (i >= 0 && grid[i * Board.WIDTH + col] === who) {
      i ++
      while (i < row) {
        grid[i * Board.WIDTH + col] = who
        i ++
      }
    }

    // check the row to the south of the play
    i = row + 1
    while (i < Board.HEIGHT && grid[i * Board.WIDTH + col] === 1-who) {
      i ++
    }
    if (i < Board.HEIGHT && grid[i * Board.WIDTH + col] === who) {
      i --
      while (i > row) {
        grid[i * Board.WIDTH + col] = who
        i --
      }
    }

    // check the diagnol to the north-west of the play
    i = row - 1
    j = col - 1
    while (i >= 0 && j >= 0 && grid[i * Board.WIDTH + j] === 1-who) {
      i --
      j --
    }
    if (i >= 0 && j >= 0 && grid[i * Board.WIDTH + j] === who) {
      i ++
      j ++
      while (i < row && j < col) {
        grid[i * Board.WIDTH + j] = who
        i ++
        j ++
      }
    }

    // check the diagnol to the south-east of the play
    i = row + 1
    j = col + 1
    while (i < Board.HEIGHT && j < Board.WIDTH && grid[i * Board.WIDTH + j] === 1-who) {
      i ++
      j ++
    }
    if (i < Board.HEIGHT && j < Board.WIDTH && grid[i * Board.WIDTH + j] === who) {
      i --
      j --
      while (i > row && j > col) {
        grid[i * Board.WIDTH + j] = who
        i --
        j --
      }
    }

    // check the diagnol to the north-east of the play
    i = row - 1
    j = col + 1
    while (i >= 0 && j < Board.WIDTH && grid[i * Board.WIDTH + j] === 1-who) {
      i --
      j ++
    }
    if (i >= 0 && j < Board.WIDTH && grid[i * Board.WIDTH + j] === who) {
      i ++
      j --
      while (i < row && j > col) {
        grid[i * Board.WIDTH + j] = who
        i ++
        j --
      }
    }

    // check the diagnol to the south-west of the play
    i = row + 1
    j = col - 1
    while (i < Board.HEIGHT && j >= 0 && grid[i * Board.WIDTH + j] === 1-who) {
      i ++
      j --
    }
    if (i < Board.HEIGHT && j >= 0 && grid[i * Board.WIDTH + j] === who) {
      i --
      j ++
      while (i > row && j < col) {
        grid[i * Board.WIDTH + j] = who
        i --
        j ++
      }
    }

    return { grid, turn: board.turn + 1 }
  },

  count(board: Board, who: number) {
    let ct = 0;
    for (let i = 0; i < Board.HEIGHT; i++) {
      for (let j = 0; j < Board.WIDTH; j++) {
        if (board.grid[i * Board.WIDTH + j] === who) ct ++
      }
    }
    return ct
  }
}


function App() {
  const [roomId     , setRoomId     ] = useState("")
  const [room       , setRoom       ] = useState<Trystero.Room | null>(null)
  const [sendMove   , setSendMove   ] = useState<Trystero.ActionSender<Move> | null>(null)
  const [board      , setBoard      ] = useState(Board.new())
  const [me, setMe] = useState(0)

  function host() {
    const roomId = _.sampleSize("abcdefghijklmnopqrstuvwxyz0123456789", 8).join("")

    setMe(0)
    setRoomId(roomId)
    setRoom(Trystero.joinRoom({appId: "othello-where-art-thou"}, roomId))
  }

  function join() {
    setMe(1)
    setRoom(Trystero.joinRoom({appId: "othello-where-art-thou"}, roomId))
  }

  useEffect(() => {
    if (!room) return

    room.onPeerJoin((peer) => {
      if (board.turn === -1) 
        setBoard((board) => ({...board, turn: 0}))
    })

    const [sendMove, whenMove] = room.makeAction<Move>("move")

    whenMove(({row, col}) => {
      setBoard((board) => Board.play(board, {who: 1 - me, row, col}))
    })

    setSendMove(() => sendMove)

    return () => {
      whenMove(() => {}) // no-op
    }
  }, [room])

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh ">
      {!room && (
        <div className="flex flex-col gap-1 w-fit">
          <span className="text-2xl text-center">O T H E L L O</span>
          <span className="text-center">⚫ ⚪</span>
          <span className="text-center">⚪ ⚫</span>
          <div className="flex gap-1">
            <button className="grow btn btn-primary" onClick={host}>Host</button>
            <input  className="input" type="text" placeholder="Room Id" value={roomId} onChange={(e) => setRoomId(e.target.value.trim().toLowerCase())} />
            <button className="grow btn btn-primary" onClick={join}>Join</button>
          </div>
        </div>
      )}

      {!!room && (
        <div className="flex flex-col gap-1">
          <span className="text-2xl text-center">O T H E L L O</span>
          <span>
            Room {roomId} / Turn {board.turn + 1} / Playing as {me === 0 && "⚫"}{me === 1 && "⚪"} 
          </span>
          <div className="grid grid-cols-8 border border-primary">
            {board.grid.map((cell, i) => {
              switch (cell) {
                case 0 : return <span key={i} className="w-10 h-10 flex justify-center items-center border border-primary cursor-not-allowed">⚫</span>
                case 1 : return <span key={i} className="w-10 h-10 flex justify-center items-center border border-primary cursor-not-allowed">⚪</span>
                default: return <span key={i} className="w-10 h-10 flex justify-center items-center border border-primary cursor-pointer hover:bg-primary/15" onClick={() => {
                  if (!sendMove) return

                  const move = {who: me, row: Math.floor(i / Board.WIDTH), col: i % Board.WIDTH}
                  setBoard((board) => Board.play(board, move))
                  sendMove(move)
                }}></span>
              }
            })}
          </div>
          <div className="flex border border-primary rounded-full overflow-hidden bg-black/10">
            <span className="h-4 bg-black" style={{
              width: `${Board.count(board, 0) / (Board.count(board, 0) + Board.count(board, 1)) * 100}%`,
            }}></span>
            {/* <span className="h-4 grow bg-[repeating-linear-gradient(45deg,black,black_20px,transparent_20px,transparent_40px)]"></span> */}
            <span className="h-4 bg-white" style={{
              width: `${Board.count(board, 1) / (Board.count(board, 0) + Board.count(board, 1)) * 100}%`,
            }}></span>
          </div>
          <span>
            {(board.turn & 1) === 0 && "It is ⚫'s turn"}{(board.turn & 1) === 1 && "It is ⚪'s turn"} {Board.count(board, 0) > Board.count(board, 1) && "/ ⚫ is winning"}{ Board.count(board, 1) > Board.count(board, 0) && "/ ⚪ is winning"}
          </span>
        </div>
      )}
    </div>
  )
}

export default App
