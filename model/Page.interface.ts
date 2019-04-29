import { IPollData } from './Poll.interface';

export interface IPageData {
    index: number
    previousUrl: string
    url: string
    nextUrl: string
    poll: IPollData
    votes: { [choice: string]: number }
    votedIds: string[]
    progress: number,
}
