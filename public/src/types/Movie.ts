import type { Producer } from "./Producer"

export interface Movie{
 id:string,
 name:string,
 madeIn:string,
 producer: Producer,
 cost: number
}
