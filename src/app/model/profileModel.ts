export interface GitHubUser {
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

export interface GitHubReadme {
    content: string;
    encoding: string;
    html_url: string;
}

export interface GitHubRepository {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    updated_at: string;
    readme: GitHubReadme | null;
}

export interface GitHubUserState {
    data: GitHubUser | null;
    repositories: GitHubRepository[];
    isLoading: boolean;
    error: string | null;
    expandedReadmes: { [key: string]: boolean };
}