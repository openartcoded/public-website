import fetch from "node-fetch";
import { Parser } from "sparqljs";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";

const SPARQL_DEFAULT_URL =
  process.env.SPARQL_DEFAULT_URL || "http://localhost:8888/public/sparql";

export const CHECK_OPERATIONS = ["*", "+", "-"];

export async function getPublicInformation(ipAddr = null) {
  const response = await fetch(`${BACKEND_URL}/api/cv`, {
    method: "GET",
    headers: ipAddr
      ? {
        "X-Forwarded-For": ipAddr,
      }
      : {},
  });
  return await response.json();
}

export async function gallery(page = 0, pageSize = 6, ipAddr) {
  const url = `${BACKEND_URL}/api/memzagram/public?page=${page}&size=${pageSize}&sort=updatedDate,DESC`;
  const response = await fetch(url, {
    method: "GET",
    headers: ipAddr
      ? {
        "X-Forwarded-For": ipAddr,
      }
      : {},
  });
  const data = await response.json();
  data.content.forEach((g) => {
    g.thumbnailUploadId = `/resource/${g.thumbnailUploadId}`;
    g.imageLink = `/resource/${g.imageUploadId}`;
  });
  return data;
}

export async function download(id, ipAddr = null) {
  const resp = await fetch(
    `${BACKEND_URL}/api/resource/public/download/${id}`,
    {
      method: "GET",
      headers: ipAddr
        ? {
          "X-Forwarded-For": ipAddr,
        }
        : {},
    },
  );
  if (resp.status !== 200) {
    throw Error(
      `response status not 200: status: ${resp.status}, message: ${resp.statusText}`,
    );
  }
  return resp;
}

export async function getBlogPosts(
  searchCriteria = {},
  page = 0,
  pageSize = 3,
  ipAddr = null,
) {
  const url = `${BACKEND_URL}/api/blog/public-search?page=${page}&size=${pageSize}&sort=updatedDate,DESC`;
  let headers = {
    "Content-Type": "application/json",
  };
  if (ipAddr) {
    headers["X-Forwarded-For"] = ipAddr;
  }
  const response = await fetch(url, {
    method: "post",
    headers,
    body: JSON.stringify(searchCriteria),
  });
  return await response.json();
}
export async function getBlogPost(id, slug, ipAddr) {
  const url = `${BACKEND_URL}/api/blog/post/${slug}/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: ipAddr
      ? {
        "X-Forwarded-For": ipAddr,
      }
      : {},
  });
  const json = await response.json();
  json.coverUrl = `/resource/${json.coverId}`;
  return json;
}

function sanitize(input) {
  let sanitized = (input || "").trim();
  if (!sanitized.length) {
    return "";
  }
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return sanitized.replace(reg, (match) => map[match]);
}

function simpleBotDetection(input, num1, num2, operation) {
  if (isNaN(input)) {
    return false;
  }
  let checkNumber = parseInt(input);
  let num1Parsed = parseInt(num1);
  let num2Parsed = parseInt(num2);
  switch (operation) {
    case "+":
      return num1Parsed + num2Parsed === checkNumber;
    case "*":
      return num1Parsed * num2Parsed === checkNumber;
    case "-":
      return num1Parsed - num2Parsed === checkNumber;
    default:
      return false;
  }
}
export async function postContactForm(formData, num1, num2, operation, ipAddr) {
  const url = `${BACKEND_URL}/api/form-contact/submit`;

  // validate check

  const checkNotBot = sanitize(formData.check);

  if (!simpleBotDetection(checkNotBot, num1, num2, operation)) {
    console.log("bot detected: ", ipAddr);
    return { valid: true, message: "Email sent." };
  }

  // sanitize & validate form
  const fullName = sanitize(formData.fullName);
  const emailAddr = sanitize(formData.emailAddr);
  const subject = sanitize(formData.subject);
  const phoneNumber = sanitize(formData.phoneNumber);
  const description = sanitize(formData.description);

  if (
    !fullName.length ||
    !emailAddr.length ||
    !subject.length ||
    !phoneNumber.length ||
    !description.length
  ) {
    return { valid: false, message: "Invalid form" };
  }

  let headers = {
    "Content-Type": "application/json",
  };
  if (ipAddr) {
    headers["X-Forwarded-For"] = ipAddr;
  }
  const response = await fetch(url, {
    method: "post",
    headers,
    body: JSON.stringify({
      fullName: fullName,
      bestTimeToCall: "", // no longer used anyway
      email: emailAddr,
      subject: subject,
      body: description,
      phoneNumber: phoneNumber,
    }),
  });
  if (response.status !== 200) {
    throw Error(response.statusText);
  }
  return { valid: true, message: "Email sent." };
}

export async function postSparqlQuery(formData, ipAddr) {
  const url = SPARQL_DEFAULT_URL;
  const query = formData.sparqlQuery;
  let sparqlResultType = "application/sparql-results+json";
  let accept = sparqlResultType;

  try {
    const sparqlQuery = new Parser().parse(query);
    if (sparqlQuery.type !== "query") {
      return { error: "inserts/updates not allowed" };
    }
    if (
      sparqlQuery.queryType === "DESCRIBE" ||
      sparqlQuery.queryType === "CONSTRUCT"
    ) {
      accept = formData.acceptType;
    }
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("query", query);
    let headers = {
      Accept: accept,
    };
    if (ipAddr) {
      headers["X-Forwarded-For"] = ipAddr;
    }
    const response = await fetch(url, {
      method: "post",
      headers,
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
