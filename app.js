const SUPABASE_URL = "YOUR_SUPABASE_URL";

const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let sessionId =
    localStorage.getItem("session_id");

if(!sessionId){

    sessionId = crypto.randomUUID();

    localStorage.setItem(
        "session_id",
        sessionId
    );
}

let chatHistory = [
    {
        role:"system",
        content:"You are ByteGenius AI assistant."
    }
];

/* COPY BUTTON */

function attachCopyButtons(container){

    container.querySelectorAll("pre").forEach(pre => {

        if(pre.querySelector(".copy-btn")) return;

        const code = pre.querySelector("code");

        if(!code) return;

        const btn = document.createElement("button");

        btn.textContent = "Copy";

        btn.className = "copy-btn";

        btn.onclick = async () => {

            await navigator.clipboard.writeText(
                code.innerText
            );

            btn.textContent = "Copied!";

            setTimeout(() => {
                btn.textContent = "Copy";
            }, 1200);
        };

        pre.appendChild(btn);
    });
}

/* ADD MESSAGE */

function addMessage(text, type){

    const chat = document.getElementById("chat");

    const div = document.createElement("div");

    div.className = "message " + type;

    if(type === "ai"){

        div.innerHTML = DOMPurify.sanitize(
            marked.parse(text)
        );

        attachCopyButtons(div);

    } else {

        div.textContent = text;
    }

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

/* SAVE TO SUPABASE */

async function saveMessage(role, message){

    await supabase
        .from("chats")
        .insert([
            {
                role,
                message,
                session_id:sessionId
            }
        ]);
}

/* SEND MESSAGE */

async function sendMessage(){

    const input = document.getElementById("prompt");

    const message = input.value.trim();

    if(!message) return;

    addMessage(message, "user");

    await saveMessage("user", message);

    chatHistory.push({
        role:"user",
        content:message
    });

    input.value = "";

    autoResizeTextarea();

    const div = document.createElement("div");

    div.className = "message ai";

    div.innerHTML = "Thinking...";

    document.getElementById("chat")
        .appendChild(div);

    let fullReply = "";

    try{

        const response = await fetch(
            "/.netlify/functions/chat",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    model:"codestral-latest",
                    messages:chatHistory
                })
            }
        );

        const data = await response.json();

        fullReply =
            data.choices[0].message.content;

        div.innerHTML = DOMPurify.sanitize(
            marked.parse(fullReply)
        );

        attachCopyButtons(div);

        chatHistory.push({
            role:"assistant",
            content:fullReply
        });

        await saveMessage(
            "assistant",
            fullReply
        );

    } catch(err){

        div.innerHTML =
            "Error: " + err.message;
    }
}

/* THEME */

document.getElementById("themeBtn").onclick = () => {
    document.body.classList.toggle("dark");
};

/* ENTER SUPPORT */

const promptInput = document.getElementById("prompt");

promptInput.addEventListener("keydown", (e) => {

    if(e.key === "Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();
    }
});

/* AUTO RESIZE */

function autoResizeTextarea(){

    promptInput.style.height = "auto";

    promptInput.style.height =
        promptInput.scrollHeight + "px";
}

promptInput.addEventListener(
    "input",
    autoResizeTextarea
);

/* SIDEBAR */

document.getElementById("menuToggle")
.addEventListener("click", () => {

    document
        .getElementById("sidebar")
        .classList
        .toggle("hidden");
});

/* EXPORT TXT */

function exportChat(){

    let text = "ByteGenius Chat Export\n\n";

    chatHistory.forEach(msg => {

        text +=
            (msg.role === "user"
            ? "User: "
            : "AI: ")
            + msg.content + "\n\n";
    });

    const blob = new Blob(
        [text],
        {type:"text/plain"}
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "chat.txt";

    a.click();
}

/* EXPORT PDF */

async function exportPDF(){

    const chat = document.getElementById("chat");

    const canvas = await html2canvas(chat,{
        scale:2,
        backgroundColor:"#fff"
    });

    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p","mm","a4");

    const pdfWidth =
        pdf.internal.pageSize.getWidth();

    const imgHeight =
        (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        imgHeight
    );

    pdf.save("chat-export.pdf");
}

/* CLEAR CHAT */

function clearChat(){

    document.getElementById("chat").innerHTML = "";

    chatHistory = [
        {
            role:"system",
            content:"You are ByteGenius AI assistant."
        }
    ];
}