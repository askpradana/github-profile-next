"use client"

import { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/storeProvider";
import { fetchGitHubUser, setExpandedReadme } from "@/app/store/profileProvider";
import { GitHubRepository } from "@/app/model/profileModel";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import "@/app/globals.css"

const components: Components = {
    img: ({ src, alt }) => (
        <img
            src={src || ''} 
            alt={alt || ''} 
            width={500}
            height={300}
            className="markdown-body img"
        />
    ),
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">
            {children}
        </a>
    ),
    samp: ({ children }) => (
        <samp className="markdown-samp">{children}</samp>
    ),
    p: ({ children, ...props }) => (
        <p {...props} className="markdown-paragraph">{children}</p>
    )
};

export default function Homepage() {
    const dispatch = useAppDispatch();
    const { data, repositories, isLoading, error, expandedReadmes } = useAppSelector((state) => state.githubUser);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        if (username) dispatch(fetchGitHubUser(username));
    };

    return (
        <main>
            {!data && !isLoading && !error && (
                <div className="hero-section">
                    <h1 className="hero-title">GitHub Profile Explorer</h1>
                    <p className="hero-subtitle">
                        Discover GitHub profiles, explore repositories, and read README files in a beautiful, organized interface.
                    </p>
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            name="username"
                            type="text"
                            className="search-input"
                            placeholder="Enter GitHub username"
                        />
                        <button 
                            type="submit" 
                            className="search-button"
                        >
                            Search
                        </button>
                    </form>
                    <div className="hero-features">
                        <div className="feature-card">
                            <div className="feature-icon">👤</div>
                            <h3 className="feature-title">Profile Overview</h3>
                            <p className="feature-description">
                                Get a quick glance at user profiles, including followers, repositories, and bio information.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📚</div>
                            <h3 className="feature-title">Repository Explorer</h3>
                            <p className="feature-description">
                                Browse through repositories with detailed information about stars, language, and descriptions.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📖</div>
                            <h3 className="feature-title">README Viewer</h3>
                            <p className="feature-description">
                                Read repository README files directly in the interface with proper markdown formatting.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                </div>
            )}

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            {data && (
                <div className="profile-section">
                    <button className="back-btn">Back</button>
                    <div className="profile-card">
                        <div className="profile-header">
                            <img
                                src={data.avatar_url}
                                alt={`${data.login}'s avatar`}
                                width={100}
                                height={100}
                                className="profile-image"
                            />
                            <div className="profile-info">
                                <h2>{data.name || data.login}</h2>
                                <p>@{data.login}</p>
                                {data.bio && <p>{data.bio}</p>}
                            </div>
                        </div>

                        <div className="profile-stats">
                            <div>
                                <div className="stat-value">{data.public_repos}</div>
                                <div className="stat-label">Repos</div>
                            </div>
                            <div>
                                <div className="stat-value">{data.followers}</div>
                                <div className="stat-label">Followers</div>
                            </div>
                            <div>
                                <div className="stat-value">{data.following}</div>
                                <div className="stat-label">Following</div>
                            </div>
                        </div>
                    </div>

                    <div className="repositories-grid">
                        {repositories.map((repo: GitHubRepository) => (
                            <div key={repo.name} className="repository-card">
                                <h3 className="repository-name">{repo.name}</h3>
                                {repo.description && (
                                    <p className="repository-description">{repo.description}</p>
                                )}
                                <div className="repository-meta">
                                    <span>⭐ {repo.stargazers_count}</span>
                                    {repo.language && <span>· {repo.language}</span>}
                                </div>
                                <div className="repository-actions">
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="repository-link"
                                    >
                                        View Repository →
                                    </a>
                                    {repo.readme && (
                                        <button
                                            onClick={() => dispatch(setExpandedReadme(repo.name))}
                                            className="readme-toggle"
                                        >
                                            {expandedReadmes[repo.name] ? 'Hide README ↑' : 'Show README ↓'}
                                        </button>
                                    )}
                                </div>
                                {repo.readme && expandedReadmes[repo.name] && (
                                    <div className="readme-section">
                                        <div className="readme-content markdown-body">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm, remarkHtml]}
                                                rehypePlugins={[rehypeRaw]}
                                                components={components}
                                            >
                                                {Buffer.from(repo.readme.content, 'base64').toString()}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}