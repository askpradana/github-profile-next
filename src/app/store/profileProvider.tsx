// Async thunk for fetching GitHub user data
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {GitHubUser, GitHubRepository, GitHubUserState} from "@/app/model/profileModel";

export const fetchGitHubUser = createAsyncThunk(
    'githubUser/fetchUser',
    async (username: string, { rejectWithValue }) => {
        try {
            // Fetch user profile
            const userResponse = await fetch(`https://api.github.com/users/${username}`);
            if (!userResponse.ok) {
                return rejectWithValue('User not found');
            }
            const userData: GitHubUser = await userResponse.json();

            // Fetch user repositories
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
            if (!reposResponse.ok) {
                return rejectWithValue('Failed to fetch repositories');
            }
            const repositories: GitHubRepository[] = await reposResponse.json();

            // Fetch README for each repository
            const reposWithReadme = await Promise.all(
                repositories.map(async (repo) => {
                    try {
                        const readmeResponse = await fetch(
                            `https://api.github.com/repos/${username}/${repo.name}/readme`
                        );
                        const readme = readmeResponse.ok ? await readmeResponse.json() : null;
                        return { ...repo, readme };
                    } catch {
                        return { ...repo, readme: null };
                    }
                })
            );

            return {
                user: userData,
                repositories: reposWithReadme
            };
        } catch {
            return rejectWithValue('Error fetching user data');
        }
    }
);

const initialState: GitHubUserState = {
    data: null,
    repositories: [],
    isLoading: false,
    error: null,
    expandedReadmes: {}
};

export const githubUserSlice = createSlice({
    name: 'githubUser',
    initialState,
    reducers: {
        setExpandedReadme: (state, action) => {
            const repoName = action.payload;
            state.expandedReadmes[repoName] = !state.expandedReadmes[repoName];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGitHubUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchGitHubUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.user;
                state.repositories = action.payload.repositories;
            })
            .addCase(fetchGitHubUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.data = null;
                state.repositories = [];
            });
    }
});

export const { setExpandedReadme } = githubUserSlice.actions;
export default githubUserSlice.reducer;