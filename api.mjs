import fetch from "node-fetch";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";

export async function getPublicInformation() {
  const response = await fetch(`${BACKEND_URL}/api/cv`);
  return await response.json();
}

export async function gallery(page = 0, pageSize = 9) {
  const url = `${BACKEND_URL}/api/memzagram/public?page=${page}&size=${pageSize}&sort=updatedDate,DESC`;
  const response = await fetch(url);
  const data = await response.json();
  data.content.forEach(
    (g) => {
        g.thumbnailUploadId = `${BACKEND_URL}/api/resource/public/download/${g.thumbnailUploadId}`;
        g.imageLink = `${BACKEND_URL}/api/resource/public/download/${g.imageUploadId}`;
    }
  );
  return data;
}
