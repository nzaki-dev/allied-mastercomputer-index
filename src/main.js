import { marked } from "marked";
import markdown from "../README.md?raw";
import "./style.css";

const content = document.querySelector("#content");
content.classList.add("home");
content.innerHTML = marked.parse(markdown).replaceAll('src="public/', 'src="/');

content.querySelectorAll("a[href]").forEach((link) => {
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

content.querySelectorAll("table").forEach((table) => {
  const headers = [...table.querySelectorAll("th")].map((th) => th.textContent);
  if (!headers.includes("Project")) {
    table.remove();
    return;
  }

  table.querySelectorAll("tbody td").forEach((cell, index) => {
    cell.setAttribute("data-label", headers[index % headers.length] ?? "");
  });

  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  table.replaceWith(wrap);
  wrap.append(table);
});

async function renderCompanies() {
  const companies = await fetch("/companies.json").then((response) => response.json());
  const grid = document.createElement("div");
  grid.className = "company-grid";
  grid.innerHTML = companies.companies
    .map(
      (entry) => `
        <div class="company-cell">
          <span class="company-name">${entry.company}</span>
          <span class="company-count">${entry.breaches}</span>
        </div>
      `,
    )
    .join("");

  const heading = [...content.querySelectorAll("h2")].find((node) => node.textContent === "Breaches per company");
  if (heading) heading.after(grid);
  else content.append(grid);
}

renderCompanies();
