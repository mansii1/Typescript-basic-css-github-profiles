import "./style.css";
import axios from "axios";

const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main") as HTMLDivElement;
const form = document.getElementById("form") as HTMLFormElement;
const search = document.getElementById("search") as HTMLInputElement;

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

interface GitHubRepo {
  name: string;
  html_url: string;
}

async function getUsers(username: string): Promise<void> {
  try {
    const { data }: { data: GitHubUser } = await axios(APIURL + username);
    createUser(data);
    getRepos(username);
  } catch (error: any) {
    console.error(error);

    if (error?.response?.status === 404) {
      createErrorCard("No profile with this username");
    }
  }
}

const createUser = (data: GitHubUser): void => {
  const cardHtml = `
    <div class="card">
      <div>
        <img
          src="${data.avatar_url}"
          alt="${data.name || data.login}"
          class="avatar"
        />
      </div>
      <div class="user-info">
        <h2>${data.name || data.login}</h2>
        <p>${data.bio || "No bio available"}</p>

        <ul>
          <li>${data.followers} <strong>Followers</strong></li>
          <li>${data.following} <strong>Following</strong></li>
          <li>${data.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos" class="repos"></div>
      </div>
    </div>`;

  main.innerHTML = cardHtml;
};

const createErrorCard = (message: string): void => {
  const cardHtml = `
    <div class="card">
      <h1>${message}</h1>
    </div>`;
  main.innerHTML = cardHtml;
};

const addRepos = (data: GitHubRepo[]): void => {
  const reposEl = document.getElementById("repos") as HTMLDivElement;
  if (!reposEl) return;
  reposEl.innerHTML = "";

  data.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
};

const getRepos = async (username: string): Promise<void> => {
  try {
    const { data }: { data: GitHubRepo[] } = await axios(
      `${APIURL}${username}/repos?sort=created`
    );
    addRepos(data);
  } catch (error) {
    console.error(error);
    createErrorCard("Problem fetching repos");
  }
};

form.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUsers(user);
    search.value = "";
  }
});
