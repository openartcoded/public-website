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
  data.content.forEach((g) => {
    g.thumbnailUploadId = `${BACKEND_URL}/api/resource/public/download/${g.thumbnailUploadId}`;
    g.imageLink = `${BACKEND_URL}/api/resource/public/download/${g.imageUploadId}`;
  });
  return data;
}

export async function getBlogPosts(
  searchCriteria = {},
  page = 0,
  pageSize = 3
) {
  const url = `${BACKEND_URL}/api/blog/public-search?page=${page}&size=${pageSize}&sort=updatedDate,DESC`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(searchCriteria),
  });
  return await response.json();
}
export async function getBlogPost(id, slug) {
  const url = `${BACKEND_URL}/api/blog/post/${slug}/${id}`;
  const response = await fetch(url);
  return await response.json();
}
export async function postContactForm(formData) {
  const url = `${BACKEND_URL}/api/form-contact/submit`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: formData.fullName,
      bestTimeToCall: "", // no longer used anyway
      email: formData.emailAddr,
      subject: formData.subject,
      body: formData.description
    }),
  });
  if(response.status !== 200) {
    throw Error(response.statusText);
  }
  return "Email sent.";
}
