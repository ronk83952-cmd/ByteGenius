const SUPABASE_URL = "https://sbsebpliapheqvgdpwbt.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNic2VicGxpYXBoZXF2Z2Rwd2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzIxNDcsImV4cCI6MjA5MzkwODE0N30.cy3ckkIG1Abu2GbkyWwJQ3YOXYrAcKzXD7xre2iObDI";

let supabase = null;

/* Supabase safely loads */
if (window.supabase) {
    supabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
} else {
    console.error("Supabase failed to load - check CDN script");
}

/* =========================
   SESSION ID
========================= */

let sessionId = localStorage.getItem("session_id");

if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
}

/* =========================
   CHAT MEMORY
========================= */

let chatHistory = [
    {
        role: "system",
        content: "You are ByteGenius AI assistant."
    }
];
