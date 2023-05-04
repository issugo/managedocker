import express, { Express, Request, Response } from 'express'
import http from 'http'
import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './types'
import path from "path";


const app: Express = express()
const index = http.createServer(app)
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(index)
const port = process.env.port || 3000


app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('chatMessage', (msg: string) => {
        console.log('user: ' + socket.id + 'message: ' + msg)
        io.emit('chatMessage', msg)
    })
})

index.listen(3000, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})