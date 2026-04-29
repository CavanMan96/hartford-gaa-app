const tableBody = document.getElementById("games");
const filter = document.getElementById("filter");

let allGames = [];

async function fetchGames() {
  try {
    const res = await fetch("/api/games");
    allGames = await res.json();
    render();
  } catch (err) {
    console.error("Error loading games", err);
  }
}

function render() {
  tableBody.innerHTML = "";

  let filtered = filter.value === "ALL"
    ? allGames
    : allGames.filter(g => g.comp.includes(filter.value));

  filtered.forEach(g => {
    const row = `
      <tr>
        <td>${g.date}</td>
        <td>${g.teams}</td>
        <td>${g.field}</td>
        <td>${g.time}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

filter.addEventListener("change", render);

// Refresh every 60 seconds
setInterval(fetchGames, 60000);

// Initial load
fetchGames();
