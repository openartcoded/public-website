import fetch from "node-fetch";
import { Parser } from "sparqljs";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";

const SPARQL_DEFAULT_URL =
  process.env.SPARQL_DEFAULT_URL || "http://localhost:8888/public/sparql";

export async function getPublicInformation() {
  const response = await fetch(`${BACKEND_URL}/api/cv`);
  return await response.json();
}

export async function gallery(page = 0, pageSize = 9) {
  const url = `${BACKEND_URL}/api/memzagram/public?page=${page}&size=${pageSize}&sort=updatedDate,DESC`;
  const response = await fetch(url);
  const data = await response.json();
  data.content.forEach((g) => {
    g.thumbnailUploadId = `/resource/${g.thumbnailUploadId}`;
    g.imageLink = `/resource/${g.imageUploadId}`;
  });
  return data;
}

export async function download(id) {
  const resp = await fetch(`${BACKEND_URL}/api/resource/public/download/${id}`);
  if(resp.status !== 200) {
    throw Error(`response status not 200: status: ${resp.status}, message: ${resp.statusText}`);
  }
  return resp;
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
  const json = await response.json();
  json.coverUrl= `/resource/${json.coverId}`;
  return json;
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
      body: formData.description,
    }),
  });
  if (response.status !== 200) {
    throw Error(response.statusText);
  }
  return "Email sent.";
}

export async function postSparqlQuery(formData) {
  const url = SPARQL_DEFAULT_URL;
  const query = formData.sparqlQuery;
  let sparqlResultType = "application/sparql-results+json";
  let accept = sparqlResultType;

  try {
    const sparqlQuery = new Parser().parse(query);
    if (sparqlQuery.type !== "query") {
      return { error: "only updates allowed" };
    }
    if (
      sparqlQuery.queryType === "DESCRIBE" ||
      sparqlQuery.queryType === "CONSTRUCT"
    ) {
      accept = formData.acceptType;
    }
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("query", query);
    const response = await fetch(url, {
      method: "post",
      headers: {
        Accept: accept,
      },
      body: urlSearchParams,
    });
    if (response.status !== 200) {
      throw Error(response.statusText);
    }
    if (accept === sparqlResultType) {
      return await response.json();
    }
    return { data: await response.text() };
  } catch (e) {
    console.error(e);
    return { error: "could not parse or execute query," + e.message };
  }
}
