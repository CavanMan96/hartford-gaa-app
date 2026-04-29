import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.get("/api/games", async (req, res) => {
  try {
    const { data } = await axios.get("http://gaaboston.com/schedules/schedule/");
    const $ = cheerio.load(data);

    let games = [];

    $("table tr").each((i, el) => {
      const row = $(el).find("td");

      if (row.length > 0) {
        const text = $(el).text();

        if (text.includes("Hartford")) {
          games.push({
            date: $(row[0]).text().trim(),
            comp: $(row[1]).text().trim(),
            teams: $(row[2]).text().trim(),
            field: $(row[3]).text().trim(),
            time: $(row[4]).text().trim(),
          });
        }
      }
    });

    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching schedule");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
