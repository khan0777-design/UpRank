async function analyze() {
  const url = document.getElementById("urlInput").value;
  const results = document.getElementById("results");

  if (!url) {
    results.innerHTML = "<p>Please enter a valid URL.</p>";
    return;
  }

  results.innerHTML = "<p>🔄 Analyzing... Please wait</p>";

  try {
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Get SEO elements
    const title = doc.querySelector("title")?.innerText || "Not found";
    const titleLength = title.length;

    const description = doc.querySelector("meta[name='description']")?.getAttribute("content") || "Not found";
    const h1 = doc.querySelector("h1")?.innerText || "Not found";

    const bodyText = doc.body.innerText;
    const wordCount = bodyText.split(/\s+/).filter(word => word).length;

    // 🔢 Scoring logic
    let score = 0;
    if (title !== "Not found") score += 20;
    if (titleLength >= 40 && titleLength <= 60) score += 10;
    if (description !== "Not found") score += 20;
    if (h1 !== "Not found") score += 20;
    if (wordCount > 300) score += 20;

    // Show results
    results.innerHTML = `
      <h2>🔍 SEO Analysis</h2>
      <p><strong>Title:</strong> ${title} (${titleLength} characters)</p>
      <p><strong>Meta Description:</strong> ${description}</p>
      <p><strong>H1 Tag:</strong> ${h1}</p>
      <p><strong>Word Count:</strong> ${wordCount} words</p>
      <h3>📊 SEO Score: ${score}/100</h3>
    `;

    // 🔘 Add download button
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download Report";
    downloadBtn.style.marginTop = "20px";
    downloadBtn.style.padding = "10px 20px";
    downloadBtn.style.backgroundColor = "#28a745";
    downloadBtn.style.color = "white";
    downloadBtn.style.border = "none";
    downloadBtn.style.borderRadius = "5px";
    downloadBtn.style.cursor = "pointer";

    downloadBtn.onclick = function () {
      const report = `
URL: ${url}

🔍 SEO Analysis Report
----------------------------
Title: ${title} (${titleLength} characters)
Meta Description: ${description}
H1 Tag: ${h1}
Word Count: ${wordCount}
SEO Score: ${score}/100
      `;

      const blob = new Blob([report], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "seo-report.txt";
      link.click();
    };

    results.appendChild(downloadBtn);
  } catch (error) {
    results.innerHTML = `<p style="color: red;">❌ Error: Could not fetch website.</p>`;
    console.error(error);
  }
}
