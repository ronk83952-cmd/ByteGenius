/* SAFE SUPABASE INIT (NO GLOBAL CONFLICT) */

const SUPABASE_URL = "https://sbsebpliapheqvgdpwbt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNic2VicGxpYXBoZXF2Z2Rwd2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzIxNDcsImV4cCI6MjA5MzkwODE0N30.cy3ckkIG1Abu2GbkyWwJQ3YOXYrAcKzXD7xre2iObDI";

let supabase = null;

window.addEventListener("DOMContentLoaded", () => {

    if (window.supabase && window.supabase.createClient) {

        supabase = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        console.log("Supabase loaded successfully");

    } else {

        console.error("Supabase not loaded");
    }
});
