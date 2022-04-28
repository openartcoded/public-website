import fetch from "node-fetch";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";

export async function getPublicInformation() {
    const cvResponse = await fetch(`${BACKEND_URL}/api/cv`);
    return await cvResponse.json();
}