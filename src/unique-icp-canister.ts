import { $update, Record, StableBTreeMap, ic } from 'azle';

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

    const vote: Vote = { id: ic.time().toString(), voterId, candidate, createdAt: ic.time() };

    // Insert the vote into the storage
    voteStorage.insert(vote.id, vote);

    return vote;
}

/**
 * Retrieves the total number of votes.
 * @returns The total number of votes.
 */
$update;
export function getTotalVotes(): number {
    return voteStorage.values().length;
}

/**
 * Checks if a user has already voted.
 * @param voterId - The ID of the voter.
 * @returns A boolean indicating whether the user has voted.
 */
export function hasUserVoted(voterId: string): boolean {
    return voteStorage.values().some(vote => vote.voterId === voterId);
}
