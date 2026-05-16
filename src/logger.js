const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZWVsYW0uZGVlcGlrYTIwMjJAdml0c3R1ZGVudC5hYy5pbiIsImV4cCI6MTc3ODkzMDc4OCwiaWF0IjoxNzc4OTI5ODg4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjgwNjBlZDMtODFmYi00MjkzLTk5MjYtN2MwMTI5Njg3MmY5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2VlbGFtIGRlZXBpa2EiLCJzdWIiOiI4ODUwYTg4MS1hM2ZlLTQxOTgtOTY0My02OWNmMGI2YmFiMjgifSwiZW1haWwiOiJzZWVsYW0uZGVlcGlrYTIwMjJAdml0c3R1ZGVudC5hYy5pbiIsIm5hbWUiOiJzZWVsYW0gZGVlcGlrYSIsInJvbGxObyI6IjIybWlzMDQxMSIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6Ijg4NTBhODgxLWEzZmUtNDE5OC05NjQzLTY5Y2YwYjZiYWIyOCIsImNsaWVudFNlY3JldCI6ImZXVkNnVGZYR3NOa3BVdUUifQ.e0-4BZrskvQz09n7p1RVRUNaH13DlJtLbb2Jv6wFfrY";

export async function Log(stack, level, pkg, message) {
  try {
    await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });
  } catch (err) {
    console.error("Logging failed", err);
  }
}