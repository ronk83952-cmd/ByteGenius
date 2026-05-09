let supabase = null;

window.addEventListener("DOMContentLoaded", () => {

    if (window.supabase?.createClient) {

        supabase = window.supabase.createClient(
            "https://sbsebpliapheqvgdpwbt.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNic2VicGxpYXBoZXF2Z2Rwd2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzIxNDcsImV4cCI6MjA5MzkwODE0N30.cy3ckkIG1Abu2GbkyWwJQ3YOXYrAcKzXD7xre2iObDI"
        );

        console.log("Supabase ready");

    } else {
        console.error("Supabase not loaded");
    }

});
