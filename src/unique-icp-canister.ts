import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';


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
 * @returns A Result indicating success or failure along with the vote record.
 */
$update;
export function vote(voterId: string, candidate: string): Result<Vote, string> {
    // Check if the user has already voted
    if (hasUserVoted(voterId)) {
        return Result.Err<Vote, string>(`User with id=${voterId} has already voted.`);
    }

    const vote: Vote = { id: uuidv4(), voterId, candidate, createdAt: ic.time() };
    
    // Insert the vote into the storage
    voteStorage.insert(vote.id, vote);
    
    // Return the result with the vote record
    return Result.Ok(vote);
}

/**
 * Retrieves the total number of votes.
 * @returns A Result containing the total number of votes or an error message.
 */
$query;
export function getTotalVotes(): Result<number, string> {
    return Result.Ok(voteStorage.values().length);
}

/**
 * Checks if a user has already voted.
 * @param voterId - The ID of the voter.
 * @returns A boolean indicating whether the user has voted.
 */
$query;
export function hasUserVoted(voterId: string): boolean {
    return voteStorage.values().some(vote => vote.voterId === voterId);
}
