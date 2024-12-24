document.addEventListener("DOMContentLoaded", async () => {
  const stats = await chrome.storage.local.get("codingTime");
  console.log("Stats", stats);
  const timeStats = document.getElementById("timeStats");

  if (stats.codingTime) {
    const html = Object.entries(stats.codingTime)
      .map(
        ([site, minutes]) => `
        <div class="site-time">
          <strong>${site}:</strong> ${minutes} minutes
        </div>
      `
      )
      .join("");

    timeStats.innerHTML = html;
  } else {
    timeStats.innerHTML = "<p>No coding time tracked yet!</p>";
  }
});
