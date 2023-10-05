
import { $update, Record, StableBTreeMap, ic, nat64 } from 'azle';
import { v4 as uuidv4 } from "uuid";

// Define the Vote record type
type Vote = Record<{
    id: string;
    voterId: string;
    candidate: string;
    createdAt: nat64;
}>

// Create a stable B-tree map for storing votes
const voteStorage = new StableBTreeMap<string, Vote>(0, 44, 1024);

/**
 * Casts a vote for a candidate.
 * @param voterId - The ID of the voter.
 * @param candidate - The chosen candidate.
 * @returns The vote record or throws an error if the voter has already voted or inputs are invalid.
 */
$update;
export function vote(voterId: string, candidate: string): Vote {
    // Validate inputs
    if (!voterId || !candidate) {
        throw Error("Invalid voterId or candidate.");
    }

    // Check if the user has already voted
    if (hasUserVoted(voterId)) {
        throw Error(`User with id=${voterId} has already voted.`);
    }

    const vote: Vote = { 
        id: uuidv4(), 
        voterId,
        candidate,
        createdAt: ic.time()
     };

    try {
        // Insert the vote into the storage
        voteStorage.insert(vote.id, vote);
        return vote;
    } catch (error) {
        // Handle the error
        console.error("Error occurred during vote insertion:", error);
        // Optionally, throw the error again to propagate it to the caller
        throw Error("Error occurred during vote insertion:");
    }


}
    

/**
 * Retrieves the total number of votes.
 * @returns The total number of votes.
 */
$update;
export function getTotalVotes(): number {
    try {
        return voteStorage.values().length;
    } catch (error) {
        console.error('An error occurred while getting the total votes:', error);
        return 0;
    }
}

/**
 * Checks if a user has already voted.
 * @param voterId - The ID of the voter.
 * @returns A boolean indicating whether the user has voted.
 */
export function hasUserVoted(voterId: string): boolean {
    try {
        return voteStorage.values().some(vote => vote.voterId === voterId);
    } catch (error) {
        console.error("Error occurred during vote retrieval:", error);
        throw Error("Error occurred during vote retrieval:");
    }
}


globalThis.crypto = {
    //@ts-ignore
    getRandomValues: () => {
      let array = new Uint8Array(32);
  
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
  
      return array;
    },
  };
  
  