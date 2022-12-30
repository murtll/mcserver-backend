import { Rcon } from 'rcon-client'

export let rcon = null

export const connectToRcon = () => {
    rcon = new Rcon({
        host: process.env.RCON_HOST, 
        port: Number(process.env.RCON_PORT), 
        password: process.env.RCON_PASS
    })

    rcon.on("connect", () => console.log("RCON connected"))
    rcon.on("authenticated", () => console.log("RCON authenticated"))
    rcon.on("end", () => console.log("RCON end"))
    rcon.on("error", (e) => {
        console.log("RCON error")
        console.log(e)
    })
}