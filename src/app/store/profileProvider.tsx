// Async thunk for fetching GitHub user data
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const fetchGitHubUser = createAsyncThunk(
    'githubUser/fetchUser',
    async (username: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);

            if (!response.ok) {
                return rejectWithValue('User not found');
            }

            const userData: GitHubUser = await response.json();
            return userData;
        } catch (error) {
            return rejectWithValue('Error fetching user');
        }
    }
);

const initialState: GitHubUserState = {
    data: null,
    isLoading: false,
    error: null
};

export const githubUserSlice = createSlice({
    name: 'githubUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGitHubUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchGitHubUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchGitHubUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.data = null;
            });
    }
});

export default githubUserSlice.reducer;