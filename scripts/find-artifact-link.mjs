import fs from "node:fs";

const html = fs.readFileSync("/home/ubuntu/browser_html/github_com_33779553877_1788454781968.html", "utf8");
const matches = [...html.matchAll(/href="([^"]*artifact[^"]*)"/gi)].map((match) => match[1]);
console.log(matches.join("\n"));
