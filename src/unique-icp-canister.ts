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
    // ... (Existing vote function)

}

/**
 * Retrieves a specific vote by its ID.
 * @param voteId - The ID of the vote to retrieve.
 * @returns The vote record or null if not found.
 */
$update;
export function getVoteById(voteId: string): Vote | null {
    try {
        return voteStorage.get(voteId) || null;
    } catch (error) {
        console.error("Error occurred during vote retrieval:", error);
        throw Error("Error occurred during vote retrieval:");
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
 * Lists all unique candidate names.
 * @returns An array of candidate names.
 */
$update;
export function listCandidates(): string[] {
    try {
        const candidates = new Set<string>();
        voteStorage.values().forEach((vote) => {
            candidates.add(vote.candidate);
        });
        return Array.from(candidates);
    } catch (error) {
        console.error('An error occurred while listing candidates:', error);
        return [];
    }
}

/**
 * Lists all unique voter IDs.
 * @returns An array of voter IDs.
 */
$update;
export function listVoters(): string[] {
    try {
        const voters = new Set<string>();
        voteStorage.values().forEach((vote) => {
            voters.add(vote.voterId);
        });
        return Array.from(voters);
    } catch (error) {
        console.error('An error occurred while listing voters:', error);
        return [];
    }
}

/**
 * Counts the number of votes for a specific candidate.
 * @param candidate - The candidate to count votes for.
 * @returns The number of votes for the candidate.
 */
$update;
export function countVotesForCandidate(candidate: string): number {
    try {
        return voteStorage.values().filter((vote) => vote.candidate === candidate).length;
    } catch (error) {
        console.error('An error occurred while counting votes for a candidate:', error);
        return 0;
    }
}

/**
 * Checks if a user has already voted.
 * @param voterId - The ID of the voter.
 * @returns A boolean indicating whether the user has voted.
 */
$update;
export function hasUserVoted(voterId: string): boolean {
    try {
        return voteStorage.values().some((vote) => vote.voterId === voterId);
    } catch (error) {
        console.error("Error occurred during vote retrieval:", error);
        throw Error("Error occurred during vote retrieval:");
    }
}

/**
 * Reset the vote storage by clearing all votes.
 */
$update;
export function resetVotes(): void {
    try {
        voteStorage.clear();
    } catch (error) {
        console.error("Error occurred while resetting votes:", error);
        throw Error("Error occurred while resetting votes:");
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
