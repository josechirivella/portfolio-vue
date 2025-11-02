import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "path";
import { SitemapStream, streamToPromise } from "sitemap";

export default defineEventHandler(async (event) => {
  // Fetch all documents
  const docs = await queryCollection(event, "content").all();
  const sitemap = new SitemapStream({
    hostname: "https://jchirivella.com",
  });

  for (const doc of docs) {
    sitemap.write({
      url: doc.path,
      changefreq: "monthly",
    });
  }

  // fetch page from /page/* folders
  const staticEndpoints = getStaticEndpoints();
  for (const staticEndpoint of staticEndpoints) {
    sitemap.write({
      url: staticEndpoint,
      changefreq: "weekly",
    });
  }

  sitemap.end();

  return streamToPromise(sitemap);
});

const getStaticEndpoints = (): string[] => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const files = getFiles(`${__dirname}/../../../../../app/pages`);
  return files
    .filter((file) => !file.includes("slug"))
    .map((file) => file.split("pages")[1])
    .map((file) => {
      return file.endsWith("index.vue")
        ? file.split("/index.vue")[0]
        : file.split(".vue")[0];
    });
};

const getFiles = (dir: string): string[] => {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return files.flat();
};
