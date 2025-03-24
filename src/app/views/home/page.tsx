"use client"

import {FormEvent, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/app/store/storeProvider";
import {fetchGitHubUser} from "@/app/store/profileProvider";
import Image from "next/image";

export default function Homepage() {
    const [username, setUsername] = useState('');
    const dispatch = useAppDispatch();
    const {data, isLoading, error} = useAppSelector((state) => state.githubUser);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (username) {
            dispatch(fetchGitHubUser(username));
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {data && (
                <div>
                    <h2>{data.name}</h2>
                    <Image src={data.avatar_url} alt={`${data.login}'s avatar`} width={80} height={80}/>
                    <p>{data.bio}</p>
                    <p>Public Repos: {data.public_repos}</p>
                    <p>Followers: {data.followers}</p>
                    <p>Following: {data.following}</p>
                </div>
            )}
        </div>
    );
}