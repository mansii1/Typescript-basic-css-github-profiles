import "./style.css";
import axios from "axios";

const APIURL = "https://api.github.com/users/";

const form = document.getElementById("form") as HTMLFormElement;
const search = document.getElementById("search") as HTMLFormElement;

async function getUsers(username: String) {
  try {
    const { data } = await axios(APIURL + username);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUsers(user);
    search.value = "";
  }
});
