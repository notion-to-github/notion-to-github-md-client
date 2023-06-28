import axios from "axios";
import { Octokit } from "octokit";

export const getGitHubAccessToken = async (code: string) => {
    // docs - https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app#about-user-access-tokens
    const res = await axios.post(
        `${process.env.GITHUB_AUTH_TOKEN_SERVER}`,
        {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.CLIENT_SECRETS,
            code: code,
        },
        {
            headers: { Accept: "application/json" },
        }
    );

    return res.data;
};

export const getGitHubAccessTokenByRefreshToken = async (
    refreshToken: string | null
) => {
    // docs - https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens#refreshing-a-user-access-token-with-a-refresh-token
    const res = await axios.post(
        `${process.env.GITHUB_AUTH_TOKEN_SERVER}`,
        {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.CLIENT_SECRETS,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        },
        {
            headers: { Accept: "application/json" },
        }
    );

    return res.data;
};

export const getAppIsInstalled = async (accessToken: string | null) => {
    const octokit = new Octokit({
        auth: accessToken,
    });

    // docs - https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-app-installations-accessible-to-the-user-access-token
    const res = await octokit.request("GET /user/installations", {
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
    console.log(res);

    for (let i = 0; i < res.data.installations.length; i++) {
        if (res.data.installations[i].app_slug === "notion-to-github-md")
            return true;
    }
    return false;
};

const runWorkflow = async (accessToken: string | null) => {
    const octokit = new Octokit({
        auth: accessToken,
    });

    // docs - https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
    const res = await octokit.request(
        "POST /repos/julyydev/automation-test/actions/workflows/main.yml/dispatches",
        {
            // owner: 'julyydev',
            // repo: 'automation-test',
            // workflow_id: 'main.yml',
            // ref: 'topic-branch',
            ref: "main",
            // inputs: {
            //     name: 'Mona the Octocat',
            //     home: 'San Francisco, CA',
            // },
        }
    );
    console.log(res);
};

export const getPublicKeyId = async (accessToken: string | null) => {
    const octokit = new Octokit({
        auth: accessToken,
    });

    // docs - https://docs.github.com/en/rest/actions/secrets?apiVersion=2022-11-28#get-a-repository-public-key
    const res = await octokit.request(
        "GET /repos/julyydev/notion-to-github-md/actions/secrets/public-key"
    );
    console.log(res);

    return res.data.key_id;
};

export const putSecrets = async (accessToken: string | null) => {
    const octokit = new Octokit({
        auth: accessToken,
    });

    const publicKeyId = await getPublicKeyId(accessToken);
    // TODO: 암호화하는 로직 추가

    // docs - https://docs.github.com/en/rest/actions/secrets?apiVersion=2022-11-28#create-or-update-a-repository-secret
    const res = await octokit.request(
        "PUT /repos/julyydev/notion-to-github-md/actions/secrets/config",
        {
            // owner: 'OWNER',
            // repo: 'REPO',
            // secret_name: 'SECRET_NAME',
            encrypted_value: "c2VjcmV0",
            key_id: publicKeyId,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        }
    );
    console.log(res);
};

export const getUserInfo = async (accessToken: string | null) => {
    const octokit = new Octokit({
        auth: accessToken,
    });

    // docs - https://docs.github.com/ko/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
    const res = await octokit.request("GET /user", {
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });

    return res.data;
};

export const getApp = async (accessToken: string | null) => {
    const octokit = new Octokit({
        auth: accessToken,
    });

    // docs - https://docs.github.com/ko/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
    const res = await octokit.request("GET /apps/notion-to-github-md", {
        app_slug: "notion-to-github-md",
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });

    return res.data;
};
