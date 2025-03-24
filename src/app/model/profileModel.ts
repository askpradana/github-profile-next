interface GitHubUser {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
    blog: string | null;
    location: string | null;
    company: string | null;
    created_at: string;
}

interface GitHubUserState {
    data: GitHubUser | null;
    isLoading: boolean;
    error: string | null;
}
