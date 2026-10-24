(() => {
  "use strict";

  if (document.getElementById("chat-everywhere")) return;

  const STORAGE = {
    notes: "ce_notes",
    screenshots: "screenshots",
    theme: "ce_selected_theme",
    messageColor: "ce_message_color",
    messages: "ce_messages",
    shares: "ce_shares"
  };

  const themes = {
    midnight: { name: "Midnight", icon: "🌌", description: "Deep night" },
    ocean: { name: "Ocean", icon: "🌊", description: "Cool blue" },
    forest: { name: "Forest", icon: "🌲", description: "Natural green" },
    sunset: { name: "Sunset", icon: "🌅", description: "Warm sunset" },
    lavender: { name: "Lavender", icon: "💜", description: "Soft violet" },
    rose: { name: "Rose", icon: "🌸", description: "Pink & coral" },
    golden: { name: "Golden", icon: "☀️", description: "Warm amber" },
    arctic: { name: "Arctic", icon: "🧊", description: "Bright & icy" }
  };

  // Simulated classmates who can reply to your messages
  const CLASSMATES = [
    { name: "Anna", color: "#8B5CF6" },
    { name: "Mark", color: "#3B82F6" },
    { name: "Sofia", color: "#EC4899" },
    { name: "Jay", color: "#10B981" },
    { name: "Liam", color: "#F59E0B" }
  ];

  // Multi-language reply banks (English / Tagalog / Bisaya)
  const REPLY_BANK = {
    en: {
      hello: [
        "Hey! How's it going?",
        "Hi there 👋 What's up?",
        "Hello! Ready to work on something?",
        "Heyyy good to see you online!"
      ],
      project: [
        "Yeah, the project is due soon. Did you finish the slides?",
        "I'm still working on my part. Need any help?",
        "Don't forget we have to submit it by Friday!",
        "I can share my notes if you want."
      ],
      homework: [
        "Ugh same, I haven't started yet 😅",
        "Which subject? I might have finished it.",
        "Wanna study together later?"
      ],
      help: [
        "Sure, what do you need help with?",
        "Of course! Tell me the problem.",
        "I'm free right now, go ahead."
      ],
      thanks: [
        "No problem!",
        "Anytime 😊",
        "Happy to help!"
      ],
      link: [
        "Nice link! I'll check it out.",
        "Thanks for sharing that 🔗",
        "Looks useful, saving it.",
        "Ohh this is interesting, thanks!",
        "Got the link, I'll open it later."
      ],
      default: [
        "Interesting!",
        "Got it 👍",
        "Okay, makes sense.",
        "Haha true",
        "Yeah I agree",
        "What do you think about that?",
        "Can you explain a bit more?",
        "Nice!",
        "Cool, let me know how it goes.",
        "I'm here if you need anything."
      ]
    },
    tl: { // Tagalog
      hello: [
        "Kamusta! Anong balita?",
        "Hello! 👋 Kumusta ka?",
        "Hi! Ready na ba tayo mag-work?",
        "Uy hello! Anong ginagawa mo?"
      ],
      project: [
        "Oo nga, malapit na deadline ng project. Tapos mo na ba slides?",
        "Ginagawa ko pa yung part ko. Kailangan mo ba ng tulong?",
        "Huwag mo kalimutan, Friday na deadline!",
        "Pwede ko i-share notes ko kung gusto mo."
      ],
      homework: [
        "Same, di pa ako nagsisimula 😅",
        "Anong subject? Baka may na-finish na ako.",
        "Gusto mo ba mag-study together later?"
      ],
      help: [
        "Sige, anong kailangan mong tulong?",
        "Syempre! Sabihin mo lang problema.",
        "Free ako ngayon, go ahead."
      ],
      thanks: [
        "Walang anuman!",
        "Anytime 😊",
        "Masaya ako makatulong!"
      ],
      link: [
        "Ayos yang link! Tingnan ko yan.",
        "Salamat sa pag-share 🔗",
        "Interesting naman, ise-save ko.",
        "Nice link! Open ko later.",
        "Got it, salamat sa link!"
      ],
      default: [
        "Interesting!",
        "Gets 👍",
        "Okay, gets ko.",
        "Haha totoo",
        "Oo agree ako",
        "Anong tingin mo diyan?",
        "Pwede mo ba i-explain pa?",
        "Nice!",
        "Sige, update mo ko later.",
        "Nandito lang ako kung may kailangan ka."
      ]
    },
    bis: { // Bisaya / Cebuano
      hello: [
        "Kumusta! Unsa'y balita?",
        "Hello! 👋 Kumusta ka?",
        "Hi! Ready na ba ta mag-work?",
        "Uy hello! Unsa imong gibuhat?"
      ],
      project: [
        "Oo, duol na ang deadline sa project. Nahuman na ba nimo ang slides?",
        "Ginahimo pa nako akong part. Kinahanglan ba nimo og tabang?",
        "Ayaw kalimti, Friday na ang deadline!",
        "Pwede nako i-share akong notes kung gusto nimo."
      ],
      homework: [
        "Same, wala pa ko nagsugod 😅",
        "Unsa nga subject? Basin naa koy nahuman.",
        "Gusto ka mag-study together unya?"
      ],
      help: [
        "Sige, unsa imong kinahanglan og tabang?",
        "Syempre! Sulti lang sa problema.",
        "Free ko karon, go ahead."
      ],
      thanks: [
        "Walay sapayan!",
        "Anytime 😊",
        "Nalipay ko makatabang!"
      ],
      link: [
        "Nindot ang link! Tan-awon nako ni.",
        "Salamat sa pag-share 🔗",
        "Interesting ni, i-save nako.",
        "Nice link! Open nako unya.",
        "Got it, salamat sa link!"
      ],
      default: [
        "Interesting!",
        "Gets 👍",
        "Okay, nasabtan nako.",
        "Haha tinuod",
        "Oo agree ko",
        "Unsa imong hunahuna ana?",
        "Pwede ba nimo i-explain pa?",
        "Nice!",
        "Sige, update ko unya.",
        "Naa ra ko diri kung naa kay kinahanglan."
      ]
    }
  };

  // Detect language of the message (simple but works well for Tagalog / Bisaya / English)
  function detectLanguage(text) {
    const lower = text.toLowerCase();

    // Strong Bisaya indicators
    const bisayaWords = /\b(kumusta|unsa|nimo|nako|ko|ka|ta|unya|karon|tabang|nindot|tinuod|nasabtan|gibuhat|nahuman|kinahanglan|ayaw|kalimti|walay|sapayan|nalipay)\b/;
    // Strong Tagalog indicators
    const tagalogWords = /\b(kamusta|anong|balita|kumusta|yung|yan|diyan|natin|tayo|mo|ko|ba|nga|lang|sige|salamat|walang|anuman|proyekto|tulong|gets|totoo|agree)\b/;

    const bisScore = (lower.match(bisayaWords) || []).length;
    const tlScore = (lower.match(tagalogWords) || []).length;

    // Common words that appear in both (slight boost)
    if (/\b(salamat|project|homework|help|link|hello|hi)\b/.test(lower)) {
      // prefer the stronger score
    }

    if (bisScore > tlScore && bisScore >= 1) return "bis";
    if (tlScore > bisScore && tlScore >= 1) return "tl";

    // Fallback: check common Tagalog/Bisaya particles
    if (/\b(ba|nga|lang|daw|naman|kasi|pero|tapos)\b/.test(lower)) return "tl";
    if (/\b(ba|gud|kay|unya|ra|lagi)\b/.test(lower)) return "bis";

    return "en"; // default to English
  }

  function pickReply(userText) {
    const lower = userText.toLowerCase();
    const lang = detectLanguage(userText);
    const bank = REPLY_BANK[lang] || REPLY_BANK.en;

    // Link detection (works for all languages)
    if (/https?:\/\//.test(userText) || /\b(link|url|website|site)\b/.test(lower)) {
      return randomFrom(bank.link);
    }

    // Greetings
    if (/\b(hello|hey|hi|kamusta|kumusta|good morning|good afternoon|maayong|magandang)\b/.test(lower)) {
      return randomFrom(bank.hello);
    }

    // Project / school work
    if (/\b(project|proyekto|assignment|presentation|slides|deadline)\b/.test(lower)) {
      return randomFrom(bank.project);
    }

    // Homework
    if (/\b(homework|hw|assignment|takdang.?aralin)\b/.test(lower)) {
      return randomFrom(bank.homework);
    }

    // Help
    if (/\b(help|tulong|tabang|stuck|confused|di.?gets|wa.?kasabot)\b/.test(lower)) {
      return randomFrom(bank.help);
    }

    // Thanks
    if (/\b(thanks|thank you|thx|ty|salamat)\b/.test(lower)) {
      return randomFrom(bank.thanks);
    }

    return randomFrom(bank.default);
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomClassmate() {
    return CLASSMATES[Math.floor(Math.random() * CLASSMATES.length)];
  }

  const container = document.createElement("section");
  container.id = "chat-everywhere";
  container.innerHTML = `
    <div class="ce-header">
      <div class="ce-brand">
        <span class="ce-brand-dot"></span>
        <span>Chat Everywhere</span>
      </div>
      <div class="ce-header-actions">
        <button class="ce-icon-button" id="ce-minimize" title="Minimize">−</button>
        <button class="ce-icon-button" id="ce-close" title="Close">×</button>
      </div>
    </div>

    <div class="ce-tabs">
      ${["chat","media","notes","groups","shares","tools"].map((tab, i) =>
        `<button class="ce-tab ${i === 0 ? "active" : ""}" data-tab="${tab}">${tab[0].toUpperCase()+tab.slice(1)}</button>`
      ).join("")}
    </div>

    <div class="ce-content">
      <div class="ce-page active" id="ce-chat">
        <div class="ce-chat-head">
          <div>
            <div class="ce-page-title">Chat</div>
            <div class="ce-page-subtitle">Drop a link to put it in the message box, or send a message.</div>
          </div>
          <button class="ce-small-button" id="ce-clear-chat">Clear</button>
        </div>
        <div class="ce-drop-hint" id="ce-drop-hint">↳ Drag a link here — it will be placed in “Type a message”</div>
        <div class="ce-chat-list" id="ce-chat-list"></div>
      </div>

      <div class="ce-page" id="ce-media">
        <div class="ce-page-title">Media</div>
        <div class="ce-page-subtitle">Saved screenshots</div>
        <div class="ce-media-grid" id="ce-media-grid"></div>
      </div>

      <div class="ce-page" id="ce-notes">
        <div class="ce-notes-top">
          <div>
            <div class="ce-page-title">Notes</div>
            <div class="ce-page-subtitle">Your saved notes</div>
          </div>
          <button class="ce-primary-button" id="ce-new-note">+ New</button>
        </div>
        <div class="ce-notes-list" id="ce-notes-list"></div>
      </div>

      <div class="ce-page" id="ce-groups">
        <div class="ce-page-title">Groups</div>
        <div class="ce-page-subtitle">Quick group spaces</div>
        <div class="ce-card-list">
          <button class="ce-group" data-group="Family Group"><span class="ce-group-icon">F</span><span><b>Family Group</b><small>Maria: See you later!</small></span><span>→</span></button>
          <button class="ce-group" data-group="School Group"><span class="ce-group-icon">S</span><span><b>School Group</b><small>John: Don't forget our project.</small></span><span>→</span></button>
          <button class="ce-group" data-group="Work Group"><span class="ce-group-icon">W</span><span><b>Work Group</b><small>Meeting at 2 PM.</small></span><span>→</span></button>
        </div>
      </div>

      <div class="ce-page" id="ce-shares">
        <div class="ce-shares-top">
          <div>
            <div class="ce-page-title">Shares</div>
            <div class="ce-page-subtitle">Links and files you shared</div>
          </div>
          <button class="ce-primary-button" id="ce-add-file">+ Add File</button>
          <input id="ce-file-input" type="file" hidden multiple>
        </div>
        <div class="ce-card-list" id="ce-shares-list">
          <div class="ce-share">
            <span class="ce-file-icon">IMG</span>
            <span><b>Vacation.jpg</b><small>Example shared item</small></span>
            <button data-share="https://images.unsplash.com/photo-1507525428034-b723cf961d3e">View</button>
          </div>
          <div class="ce-share">
            <span class="ce-file-icon">WEB</span>
            <span><b>OpenAI</b><small>Example web link</small></span>
            <button data-share="https://openai.com/">View</button>
          </div>
          <div class="ce-share">
            <span class="ce-file-icon">LINK</span>
            <span><b>MDN Web Docs</b><small>Example reference</small></span>
            <button data-share="https://developer.mozilla.org/">View</button>
          </div>
        </div>
      </div>

      <div class="ce-page" id="ce-tools">
        <div class="ce-page-title">Tools</div>
        <div class="ce-page-subtitle">Useful browser tools</div>

        <button class="ce-tool" id="ce-open-notepad">
          <span class="ce-tool-icon">N</span>
          <span class="ce-tool-info"><b>Notepad</b><small>Create, edit, save and delete notes</small></span>
          <span>→</span>
        </button>

        <button class="ce-tool" id="ce-open-snipping">
          <span class="ce-tool-icon">S</span>
          <span class="ce-tool-info"><b>Snipping Tool</b><small>Select and capture part of the page</small></span>
          <span>→</span>
        </button>

        <button class="ce-tool" id="ce-open-theme">
          <span class="ce-tool-icon">T</span>
          <span class="ce-tool-info"><b>Theme</b><small>Change the appearance</small></span>
          <span>→</span>
        </button>

        <button class="ce-tool" id="ce-save-all">
          <span class="ce-tool-icon">↓</span>
          <span class="ce-tool-info"><b>Save data</b><small>Export your notes and links as JSON</small></span>
          <span>→</span>
        </button>
      </div>
    </div>

    <div class="ce-input-area" id="ce-input-area">
      <input id="ce-message-input" type="text" placeholder="Type a message...">
      <button id="ce-send">Send</button>
    </div>
  `;

  document.body.appendChild(container);

  const $ = (selector, root = container) => root.querySelector(selector);
  const $$ = (selector, root = container) => [...root.querySelectorAll(selector)];

  const tabs = $$(".ce-tab");
  const pages = $$(".ce-page");
  const input = $("#ce-message-input");
  const chatList = $("#ce-chat-list");
  const mediaGrid = $("#ce-media-grid");
  const notesList = $("#ce-notes-list");
  const sharesList = $("#ce-shares-list");

  let minimized = false;

  function toast(message) {
    const old = document.querySelector(".ce-toast");
    if (old) old.remove();

    const el = document.createElement("div");
    el.className = "ce-toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("ce-toast-hide"), 1800);
    setTimeout(() => el.remove(), 2150);
  }

  async function getStorage(key, fallback) {
    const result = await chrome.storage.local.get([key]);
    return result[key] ?? fallback;
  }

  async function setStorage(key, value) {
    await chrome.storage.local.set({ [key]: value });
  }

  function openTab(name) {
    tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.tab === name));
    pages.forEach(page => page.classList.toggle("active", page.id === `ce-${name}`));

    if (name === "media") loadMedia();
    if (name === "notes") loadNotes();
    if (name === "shares") loadShares();
  }

  tabs.forEach(tab => tab.addEventListener("click", () => openTab(tab.dataset.tab)));

  function getUrlFromMessage(text) {
    const clean = String(text || "").replace(/^🔗\s*/, "").trim();
    try {
      const url = new URL(clean);
      if (url.protocol === "http:" || url.protocol === "https:") return url;
    } catch (_) {}
    return null;
  }

  function getYouTubeId(url) {
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return url.pathname.slice(1).split("/")[0];
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" || parts[0] === "embed") return parts[1];
    }
    return null;
  }

  function makeLinkPreview(url) {
    const card = document.createElement("div");
    card.className = "ce-link-preview";

    const youtubeId = getYouTubeId(url);
    const isYouTube = Boolean(youtubeId);
    const domain = url.hostname.replace(/^www\./, "");

    const label = document.createElement("div");
    label.className = "ce-link-label";
    label.textContent = isYouTube ? "▶ YouTube" : `🔗 ${domain}`;
    card.appendChild(label);

    if (isYouTube) {
      const imageWrap = document.createElement("div");
      imageWrap.className = "ce-link-image-wrap";

      const image = document.createElement("img");
      image.className = "ce-link-thumbnail";
      image.src = `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`;
      image.alt = "YouTube video thumbnail";
      image.loading = "lazy";

      const play = document.createElement("span");
      play.className = "ce-link-play";
      play.textContent = "▶";

      imageWrap.append(image, play);
      imageWrap.addEventListener("click", () => window.open(url.href, "_blank", "noopener,noreferrer"));
      card.appendChild(imageWrap);
    }

    const title = document.createElement("div");
    title.className = "ce-link-title";
    title.textContent = isYouTube ? "YouTube Video" : domain;
    card.appendChild(title);

    const open = document.createElement("a");
    open.className = "ce-link-open";
    open.href = url.href;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.textContent = isYouTube ? "Watch video on YouTube" : "Open website";
    card.appendChild(open);

    const urlText = document.createElement("a");
    urlText.className = "ce-link-url";
    urlText.href = url.href;
    urlText.target = "_blank";
    urlText.rel = "noopener noreferrer";
    urlText.textContent = "Open link";
    card.appendChild(urlText);

    return card;
  }

  function addMessage(text, who = "You", attachment = null) {
    const row = document.createElement("div");
    row.className = `ce-message ${who === "You" ? "ce-message-you" : ""}`;

    const avatar = document.createElement("div");
    avatar.className = "ce-avatar";
    avatar.textContent = who[0].toUpperCase();

    const body = document.createElement("div");
    body.className = "ce-message-text";

    const name = document.createElement("strong");
    name.textContent = who;
    body.appendChild(name);

    if (attachment?.type === "image") {
      const imageCard = document.createElement("div");
      imageCard.className = "ce-dropped-image-card";

      const image = document.createElement("img");
      image.className = "ce-dropped-image";
      image.src = attachment.src;
      image.alt = attachment.name || "Dropped image";
      image.loading = "lazy";
      image.addEventListener("click", () => openImageViewer(attachment.src, attachment.name || "image"));

      const caption = document.createElement("div");
      caption.className = "ce-dropped-image-name";
      caption.textContent = attachment.name || "Image";

      imageCard.append(image, caption);
      body.appendChild(imageCard);
    } else {
      const url = getUrlFromMessage(text);
      if (url) {
        body.appendChild(makeLinkPreview(url));
      } else {
        const p = document.createElement("p");
        p.textContent = text;
        body.appendChild(p);
      }
    }

    const time = document.createElement("small");
    time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    body.append(time);
    row.append(avatar, body);
    chatList.appendChild(row);
    chatList.scrollTop = chatList.scrollHeight;
  }

  async function loadMessages() {
    const messages = await getStorage(STORAGE.messages, []);
    chatList.innerHTML = "";
    if (!messages.length) {
      addMessage("Hi! Type in English, Tagalog, or Bisaya — we'll reply in the same language ✨ Drag a link too!", "Anna");
      return;
    }
    messages.forEach(m => addMessage(m.text, m.who, m.attachment));
  }

  async function sendMessage(text = input.value, options = {}) {
    text = String(text || "").trim();
    if (!text) return;

    const { skipReply = false } = options;

    const messages = await getStorage(STORAGE.messages, []);
    messages.push({ text, who: "You", createdAt: new Date().toISOString() });
    await setStorage(STORAGE.messages, messages.slice(-100));
    addMessage(text, "You");
    input.value = "";

    // Simulate a classmate replying (unless this is an internal system message)
    if (!skipReply) {
      scheduleClassmateReply(text);
    }
  }

  let typingRow = null;
  let replyTimeout = null;

  function showTypingIndicator(who) {
    hideTypingIndicator();
    typingRow = document.createElement("div");
    typingRow.className = "ce-message ce-typing";
    typingRow.innerHTML = `
      <div class="ce-avatar">${who[0].toUpperCase()}</div>
      <div class="ce-message-text">
        <strong>${who}</strong>
        <p class="ce-typing-dots"><span>.</span><span>.</span><span>.</span></p>
      </div>
    `;
    chatList.appendChild(typingRow);
    chatList.scrollTop = chatList.scrollHeight;
  }

  function hideTypingIndicator() {
    if (typingRow) {
      typingRow.remove();
      typingRow = null;
    }
  }

  function scheduleClassmateReply(userText) {
    // Cancel any previous pending reply
    if (replyTimeout) {
      clearTimeout(replyTimeout);
      hideTypingIndicator();
    }

    const classmate = randomClassmate();
    const delay = 700 + Math.random() * 1400; // 0.7s – 2.1s (faster for testing)

    console.log("[Chat Everywhere] Scheduling reply from", classmate.name);

    // Show typing indicator after a short pause
    setTimeout(() => {
      showTypingIndicator(classmate.name);
    }, 350);

    replyTimeout = setTimeout(async () => {
      hideTypingIndicator();

      const replyText = pickReply(userText);
      console.log("[Chat Everywhere] Sending reply:", replyText);

      const messages = await getStorage(STORAGE.messages, []);
      messages.push({
        text: replyText,
        who: classmate.name,
        createdAt: new Date().toISOString()
      });
      await setStorage(STORAGE.messages, messages.slice(-100));
      addMessage(replyText, classmate.name);

      replyTimeout = null;
    }, delay);
  }

  async function sendImage(src, name = "Image") {
    if (!src) return;
    const messages = await getStorage(STORAGE.messages, []);
    messages.push({
      text: "",
      who: "You",
      attachment: { type: "image", src, name },
      createdAt: new Date().toISOString()
    });
    try {
      await setStorage(STORAGE.messages, messages.slice(-100));
      addMessage("", "You", { type: "image", src, name });
      toast("Image added to chat");
    } catch (error) {
      console.error(error);
      toast("Image is too large to save");
    }
  }

  $("#ce-send").addEventListener("click", () => sendMessage());
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  $("#ce-clear-chat").addEventListener("click", async () => {
    if (!confirm("Clear all chat messages?")) return;
    await setStorage(STORAGE.messages, []);
    await loadMessages();
    toast("Chat cleared");
  });

  // Drag links from other websites.
  container.addEventListener("dragover", e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    container.classList.add("ce-dragging");
  });

  container.addEventListener("dragleave", e => {
    if (!container.contains(e.relatedTarget)) container.classList.remove("ce-dragging");
  });

  container.addEventListener("drop", async e => {
    e.preventDefault();
    container.classList.remove("ce-dragging");

    const dt = e.dataTransfer;
    const files = [...(dt.files || [])];
    const imageFile = files.find(file => file.type.startsWith("image/"));

    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        toast("Image must be 5 MB or smaller");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => sendImage(reader.result, imageFile.name);
      reader.onerror = () => toast("Could not read the image");
      reader.readAsDataURL(imageFile);
      return;
    }

    const uri = dt.getData("text/uri-list").split("\n")[0].trim();
    const plain = dt.getData("text/plain").trim();
    const html = dt.getData("text/html");

    // When an image is dragged from a webpage, browsers usually provide its <img src>.
    if (html) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const img = doc.querySelector("img[src]");
      if (img?.src) {
        const imageUrl = new URL(img.getAttribute("src"), location.href).href;
        await sendImage(imageUrl, img.alt || "Dropped image");
        return;
      }
    }

    let link = uri;
    if (!link && plain && /^https?:\/\//i.test(plain)) link = plain;

    if (link) {
      // Put the dragged link into the message composer instead of sending it immediately.
      // The user can edit it and press Send/Enter when ready.
      input.value = link;
      input.focus();
      try {
        input.setSelectionRange(input.value.length, input.value.length);
      } catch (_) {}
      toast("Link added to Type a message");
    } else if (plain) {
      input.value = plain;
      input.focus();
      try {
        input.setSelectionRange(input.value.length, input.value.length);
      } catch (_) {}
      toast("Text added to Type a message");
    } else {
      toast("No link, image, or text found");
    }
  });

  // Close/minimize.
  $("#ce-close").addEventListener("click", () => container.remove());

  $("#ce-minimize").addEventListener("click", () => {
    minimized = !minimized;
    container.classList.toggle("ce-minimized", minimized);
    $("#ce-minimize").textContent = minimized ? "+" : "−";
  });

  // Notes.
  function noteObject() {
    return {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async function getNotes() {
    return getStorage(STORAGE.notes, []);
  }

  async function saveNotes(notes) {
    await setStorage(STORAGE.notes, notes);
  }

  async function createNewNote(openEditor = true) {
    const notes = await getNotes();
    const note = noteObject();
    notes.unshift(note);
    await saveNotes(notes);
    await loadNotes();
    if (openEditor) openNotepad(note.id);
  }

  async function loadNotes() {
    const notes = await getNotes();
    notesList.innerHTML = "";

    if (!notes.length) {
      notesList.innerHTML = `<div class="ce-empty"><b>No notes yet</b><span>Click + New to create one.</span></div>`;
      return;
    }

    notes.forEach(note => {
      const item = document.createElement("div");
      item.className = "ce-note-item";

      const info = document.createElement("div");
      info.className = "ce-note-info";

      const title = document.createElement("b");
      title.textContent = note.title || "Untitled Note";

      const preview = document.createElement("span");
      preview.textContent = note.content ? note.content.slice(0, 80) : "Empty note";

      const date = document.createElement("small");
      date.textContent = new Date(note.updatedAt).toLocaleString([], {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      });

      info.append(title, preview, date);

      const actions = document.createElement("div");
      actions.className = "ce-note-actions";

      const edit = document.createElement("button");
      edit.textContent = "Edit";
      edit.addEventListener("click", e => {
        e.stopPropagation();
        openNotepad(note.id);
      });

      const del = document.createElement("button");
      del.textContent = "×";
      del.title = "Delete note";
      del.addEventListener("click", async e => {
        e.stopPropagation();
        if (!confirm(`Delete "${note.title}"?`)) return;
        const current = await getNotes();
        await saveNotes(current.filter(n => n.id !== note.id));
        await loadNotes();
        toast("Note deleted");
      });

      actions.append(edit, del);
      item.append(info, actions);
      item.addEventListener("click", () => openNotepad(note.id));
      notesList.appendChild(item);
    });
  }

  $("#ce-new-note").addEventListener("click", () => createNewNote(true));

  async function openNotepad(noteId) {
    document.querySelector(".ce-notepad")?.remove();

    let notes = await getNotes();
    let note = notes.find(n => n.id === noteId);

    if (!note) {
      if (!notes.length) {
        note = noteObject();
        notes.unshift(note);
        await saveNotes(notes);
      } else {
        note = notes[0];
      }
    }

    const panel = document.createElement("div");
    panel.className = "ce-notepad";
    panel.innerHTML = `
      <div class="ce-notepad-header">
        <b>Notepad</b>
        <button class="ce-notepad-close">×</button>
      </div>
      <div class="ce-notepad-toolbar">
        <button class="ce-note-new-inside">+ New Note</button>
        <button class="ce-note-all">Notes</button>
        <button class="ce-note-export">Download</button>
      </div>
      <input class="ce-notepad-title" placeholder="Note title">
      <textarea class="ce-notepad-text" placeholder="Write something..."></textarea>
      <div class="ce-notepad-footer">
        <span class="ce-note-status">Saved</span>
        <div>
          <button class="ce-note-save">Save</button>
          <button class="ce-note-delete">Delete</button>
        </div>
      </div>
    `;

    container.appendChild(panel);

    const title = $(".ce-notepad-title", panel);
    const text = $(".ce-notepad-text", panel);
    const status = $(".ce-note-status", panel);

    title.value = note.title || "";
    text.value = note.content || "";

    let timer;
    async function saveCurrentNote(show = true) {
      clearTimeout(timer);
      if (show) status.textContent = "Saving...";

      timer = setTimeout(async () => {
        const current = await getNotes();
        const target = current.find(n => n.id === note.id);
        if (!target) return;

        target.title = title.value.trim() || "Untitled Note";
        target.content = text.value;
        target.updatedAt = new Date().toISOString();

        await saveNotes(current);
        status.textContent = "Saved";
      }, 250);
    }

    title.addEventListener("input", () => saveCurrentNote());
    text.addEventListener("input", () => saveCurrentNote());

    $(".ce-note-save", panel).addEventListener("click", async () => {
      clearTimeout(timer);
      const current = await getNotes();
      const target = current.find(n => n.id === note.id);
      if (!target) return;
      target.title = title.value.trim() || "Untitled Note";
      target.content = text.value;
      target.updatedAt = new Date().toISOString();
      await saveNotes(current);
      status.textContent = "Saved";
      await loadNotes();
      toast("Note saved");
    });

    $(".ce-note-new-inside", panel).addEventListener("click", async () => {
      await createNewNote(true);
      panel.remove();
    });

    $(".ce-note-all", panel).addEventListener("click", async () => {
      panel.remove();
      openTab("notes");
      await loadNotes();
    });

    $(".ce-note-export", panel).addEventListener("click", async () => {
      const current = await getNotes();
      downloadBlob(JSON.stringify(current, null, 2), "chat-everywhere-notes.json", "application/json");
      toast("Notes downloaded");
    });

    $(".ce-note-delete", panel).addEventListener("click", async () => {
      if (!confirm(`Delete "${note.title}"?`)) return;
      const current = await getNotes();
      await saveNotes(current.filter(n => n.id !== note.id));
      panel.remove();
      await loadNotes();
      openTab("notes");
      toast("Note deleted");
    });

    $(".ce-notepad-close", panel).addEventListener("click", () => panel.remove());
  }

  $("#ce-open-notepad").addEventListener("click", async () => {
    const notes = await getNotes();
    if (!notes.length) await createNewNote(true);
    else openNotepad(notes[0].id);
  });

  // Themes.
  async function applyTheme(name) {
    Object.keys(themes).forEach(key => container.classList.remove(`ce-theme-${key}`));
    const selected = themes[name] ? name : "midnight";
    container.classList.add(`ce-theme-${selected}`);
    await setStorage(STORAGE.theme, selected);
  }

  async function applyMessageColor(color) {
    const selected = color || "#F8FAFC";
    container.style.setProperty("--ce-message-color", selected);
    await setStorage(STORAGE.messageColor, selected);
  }

  async function loadTheme() {
    const selected = await getStorage(STORAGE.theme, "midnight");
    await applyTheme(selected);
    const messageColor = await getStorage(STORAGE.messageColor, "#F8FAFC");
    await applyMessageColor(messageColor);
  }

  function openThemePanel() {
    document.querySelector(".ce-theme-panel")?.remove();

    const panel = document.createElement("div");
    panel.className = "ce-theme-panel";
    panel.innerHTML = `
      <div class="ce-theme-panel-header">
        <b>Choose Theme</b>
        <button class="ce-theme-close">×</button>
      </div>
      <div class="ce-theme-options"></div>
      <div class="ce-palette-section">
        <div class="ce-palette-title">Message Font Color</div>
        <div class="ce-color-palette" id="ce-message-palette"></div>
      </div>
    `;

    container.appendChild(panel);
    const options = $(".ce-theme-options", panel);

    Object.entries(themes).forEach(([key, theme]) => {
      const button = document.createElement("button");
      button.className = `ce-theme-option ce-theme-${key}`;
      button.innerHTML = `
        <span class="ce-theme-preview">${theme.icon}</span>
        <span><b>${theme.name}</b><small>${theme.description}</small></span>
        <span>✓</span>
      `;
      button.addEventListener("click", async () => {
        await applyTheme(key);
        toast(`${theme.name} theme applied`);
      });
      options.appendChild(button);
    });

    const palette = $("#ce-message-palette", panel);
    const colors = [
      { name: "White", value: "#F8FAFC" },
      { name: "Black", value: "#111827" },
      { name: "Sky", value: "#38BDF8" },
      { name: "Blue", value: "#60A5FA" },
      { name: "Purple", value: "#C084FC" },
      { name: "Pink", value: "#F472B6" },
      { name: "Red", value: "#FB7185" },
      { name: "Orange", value: "#FB923C" },
      { name: "Yellow", value: "#FACC15" },
      { name: "Green", value: "#4ADE80" }
    ];

    colors.forEach(color => {
      const swatch = document.createElement("button");
      swatch.className = "ce-color-swatch";
      swatch.title = color.name;
      swatch.setAttribute("aria-label", `${color.name} message font color`);
      swatch.style.background = color.value;
      swatch.addEventListener("click", async () => {
        await applyMessageColor(color.value);
        palette.querySelectorAll(".ce-color-swatch").forEach(item => item.classList.remove("active"));
        swatch.classList.add("active");
        toast(`${color.name} message color applied`);
      });
      palette.appendChild(swatch);
    });

    getStorage(STORAGE.messageColor, "#F8FAFC").then(current => {
      [...palette.children].forEach((swatch, index) => {
        if (colors[index]?.value.toLowerCase() === String(current).toLowerCase()) swatch.classList.add("active");
      });
    });

    $(".ce-theme-close", panel).addEventListener("click", () => panel.remove());
  }

  $("#ce-open-theme").addEventListener("click", openThemePanel);

  // Media.
  async function loadMedia() {
    const screenshots = await getStorage(STORAGE.screenshots, []);
    mediaGrid.innerHTML = "";

    if (!screenshots.length) {
      mediaGrid.innerHTML = `<div class="ce-empty"><b>No screenshots yet</b><span>Use Tools → Snipping Tool.</span></div>`;
      return;
    }

    screenshots.forEach(screenshot => {
      const item = document.createElement("div");
      item.className = "ce-media-item";

      const img = document.createElement("img");
      img.src = screenshot.image;
      img.alt = "Saved screenshot";

      const overlay = document.createElement("div");
      overlay.className = "ce-media-overlay";

      const view = document.createElement("button");
      view.textContent = "View";
      view.addEventListener("click", () => openImageViewer(screenshot.image));

      const download = document.createElement("button");
      download.textContent = "↓";
      download.title = "Download";
      download.addEventListener("click", () => {
        downloadDataUrl(screenshot.image, `screenshot-${Date.now()}.png`);
        toast("Screenshot downloaded");
      });

      const remove = document.createElement("button");
      remove.textContent = "×";
      remove.title = "Delete";
      remove.addEventListener("click", async () => {
        if (!confirm("Delete this screenshot?")) return;
        await chrome.runtime.sendMessage({ type: "DELETE_SCREENSHOT", id: screenshot.id });
        await loadMedia();
        toast("Screenshot deleted");
      });

      overlay.append(view, download, remove);
      item.append(img, overlay);
      item.addEventListener("dblclick", () => openImageViewer(screenshot.image));
      mediaGrid.appendChild(item);
    });
  }

  function openImageViewer(src, filename = "image.png") {
    const viewer = document.createElement("div");
    viewer.className = "ce-image-viewer";
    viewer.innerHTML = `
      <div class="ce-viewer-box">
        <button class="ce-viewer-close">×</button>
        <img src="${src}" alt="Screenshot preview">
        <div class="ce-viewer-actions">
          <button class="ce-viewer-download">Download</button>
        </div>
      </div>
    `;
    document.documentElement.appendChild(viewer);

    $(".ce-viewer-close", viewer).addEventListener("click", () => viewer.remove());
    $(".ce-viewer-download", viewer).addEventListener("click", () => {
      downloadDataUrl(src, filename || `image-${Date.now()}.png`);
      toast("Image downloaded");
    });
    viewer.addEventListener("click", e => {
      if (e.target === viewer) viewer.remove();
    });
  }

  // Snipping tool.
  $("#ce-open-snipping").addEventListener("click", startSnipping);

  function startSnipping() {
    if (document.getElementById("ce-snipping-overlay")) return;

    container.classList.add("ce-hidden-for-screenshot");

    const overlay = document.createElement("div");
    overlay.id = "ce-snipping-overlay";
    overlay.innerHTML = `
      <div class="ce-snipping-help">Drag to select an area <span>ESC to cancel</span></div>
      <div class="ce-selection"></div>
    `;
    document.documentElement.appendChild(overlay);

    const selection = $(".ce-selection", overlay);
    let startX = 0, startY = 0, selecting = false;

    const cleanup = () => {
      overlay.remove();
      container.classList.remove("ce-hidden-for-screenshot");
      document.removeEventListener("keydown", escape);
    };

    const escape = e => {
      if (e.key === "Escape") cleanup();
    };

    document.addEventListener("keydown", escape);

    overlay.addEventListener("mousedown", e => {
      if (e.button !== 0) return;
      selecting = true;
      startX = e.clientX;
      startY = e.clientY;
      selection.style.left = `${startX}px`;
      selection.style.top = `${startY}px`;
      selection.style.width = "0px";
      selection.style.height = "0px";
      selection.style.display = "block";
    });

    overlay.addEventListener("mousemove", e => {
      if (!selecting) return;

      const left = Math.min(startX, e.clientX);
      const top = Math.min(startY, e.clientY);
      const width = Math.abs(e.clientX - startX);
      const height = Math.abs(e.clientY - startY);

      selection.style.left = `${left}px`;
      selection.style.top = `${top}px`;
      selection.style.width = `${width}px`;
      selection.style.height = `${height}px`;
    });

    overlay.addEventListener("mouseup", async () => {
      if (!selecting) return;
      selecting = false;

      const rect = selection.getBoundingClientRect();
      if (rect.width < 5 || rect.height < 5) {
        cleanup();
        return;
      }

      overlay.remove();

      try {
        await new Promise(resolve => requestAnimationFrame(resolve));

        const response = await chrome.runtime.sendMessage({ type: "CAPTURE_SCREEN" });
        if (!response?.success) throw new Error(response?.error || "Screenshot failed.");

        const cropped = await cropScreenshot(response.dataUrl, rect);

        const saved = await chrome.runtime.sendMessage({
          type: "SAVE_SCREENSHOT",
          image: cropped
        });

        if (!saved?.success) throw new Error(saved?.error || "Could not save screenshot.");

        cleanup();
        openTab("media");
        await loadMedia();
        toast("Screenshot saved to Media");
      } catch (error) {
        cleanup();
        console.error(error);
        toast(error?.message || "Screenshot failed");
      }
    });
  }

  function cropScreenshot(dataUrl, rect) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        try {
          const scaleX = image.naturalWidth / window.innerWidth;
          const scaleY = image.naturalHeight / window.innerHeight;

          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(rect.width * scaleX));
          canvas.height = Math.max(1, Math.round(rect.height * scaleY));

          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            image,
            Math.round(rect.left * scaleX),
            Math.round(rect.top * scaleY),
            Math.round(rect.width * scaleX),
            Math.round(rect.height * scaleY),
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(canvas.toDataURL("image/png"));
        } catch (e) {
          reject(e);
        }
      };

      image.onerror = () => reject(new Error("Could not process screenshot."));
      image.src = dataUrl;
    });
  }

  // Groups and shares.
  $$(".ce-group").forEach(button => {
    button.addEventListener("click", async () => {
      const group = button.dataset.group;
      openTab("chat");
      // System-style message – don't trigger auto-reply
      await sendMessage(`Opened ${group}`, { skipReply: true });
      toast(`${group} opened`);

      // Optionally have a group member say something
      setTimeout(async () => {
        const member = group.includes("School") ? "John" : group.includes("Family") ? "Maria" : "Alex";
        const greetings = {
          "School Group": "Hey, don't forget our project is due soon!",
          "Family Group": "See you later!",
          "Work Group": "Meeting still at 2 PM, right?"
        };
        const text = greetings[group] || "Hello everyone!";
        const messages = await getStorage(STORAGE.messages, []);
        messages.push({ text, who: member, createdAt: new Date().toISOString() });
        await setStorage(STORAGE.messages, messages.slice(-100));
        addMessage(text, member);
      }, 700);
    });
  });

  $$("[data-share]").forEach(button => {
    button.addEventListener("click", () => {
      const url = button.dataset.share;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  async function loadShares() {
    const files = await getStorage(STORAGE.shares, []);
    const userFiles = files.filter(file => file && file.data);

    // Keep the built-in examples, then add the user's uploaded files.
    sharesList.innerHTML = `
      <div class="ce-share">
        <span class="ce-file-icon">IMG</span>
        <span><b>Vacation.jpg</b><small>Example shared item</small></span>
        <button data-share="https://images.unsplash.com/photo-1507525428034-b723cf961d3e">View</button>
      </div>
      <div class="ce-share">
        <span class="ce-file-icon">WEB</span>
        <span><b>OpenAI</b><small>Example web link</small></span>
        <button data-share="https://openai.com/">View</button>
      </div>
      <div class="ce-share">
        <span class="ce-file-icon">LINK</span>
        <span><b>MDN Web Docs</b><small>Example reference</small></span>
        <button data-share="https://developer.mozilla.org/">View</button>
      </div>`;

    $$("[data-share]", sharesList).forEach(button => {
      button.addEventListener("click", () => window.open(button.dataset.share, "_blank", "noopener,noreferrer"));
    });

    userFiles.forEach(file => {
      const item = document.createElement("div");
      item.className = "ce-share ce-user-share";

      const icon = document.createElement("span");
      icon.className = "ce-file-icon";
      icon.textContent = file.type?.startsWith("image/") ? "IMG" : "FILE";

      const info = document.createElement("span");
      const name = document.createElement("b");
      name.textContent = file.name;
      const meta = document.createElement("small");
      meta.textContent = `${formatBytes(file.size)} • ${file.type || "File"}`;
      info.append(name, meta);

      const actions = document.createElement("div");
      actions.className = "ce-share-actions";

      const view = document.createElement("button");
      view.textContent = file.type?.startsWith("image/") ? "View" : "Open";
      view.addEventListener("click", () => openSharedFile(file));

      const download = document.createElement("button");
      download.textContent = "↓";
      download.title = "Download";
      download.addEventListener("click", () => {
        downloadDataUrl(file.data, file.name);
        toast("File downloaded");
      });

      const remove = document.createElement("button");
      remove.textContent = "×";
      remove.title = "Delete file";
      remove.addEventListener("click", async () => {
        if (!confirm(`Delete "${file.name}" from Shares?`)) return;
        const current = await getStorage(STORAGE.shares, []);
        await setStorage(STORAGE.shares, current.filter(item => item.id !== file.id));
        await loadShares();
        toast("File deleted");
      });

      actions.append(view, download, remove);
      item.append(icon, info, actions);
      sharesList.appendChild(item);
    });
  }

  function formatBytes(bytes) {
    const size = Number(bytes) || 0;
    if (!size) return "0 KB";
    if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  function openSharedFile(file) {
    if (file.type?.startsWith("image/")) {
      openImageViewer(file.data, file.name);
      return;
    }

    const link = document.createElement("a");
    link.href = file.data;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  $("#ce-add-file").addEventListener("click", () => $("#ce-file-input").click());

  $("#ce-file-input").addEventListener("change", async e => {
    const selected = [...e.target.files];
    e.target.value = "";
    if (!selected.length) return;

    const allowed = selected.filter(file => file.size <= 5 * 1024 * 1024);
    if (allowed.length !== selected.length) toast("Files over 5 MB were skipped");

    try {
      const current = await getStorage(STORAGE.shares, []);
      for (const file of allowed) {
        const data = await readFileAsDataUrl(file);
        current.unshift({
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          data,
          addedAt: new Date().toISOString()
        });
      }
      await setStorage(STORAGE.shares, current.slice(0, 20));
      await loadShares();
      toast(`${allowed.length} file${allowed.length === 1 ? "" : "s"} added to Shares`);
    } catch (error) {
      console.error(error);
      toast("Could not save file. Try a smaller file.");
    }
  });

  // Export saved data.
  $("#ce-save-all").addEventListener("click", async () => {
    const notes = await getNotes();
    const messages = await getStorage(STORAGE.messages, []);
    const data = {
      exportedAt: new Date().toISOString(),
      notes,
      messages
    };
    downloadBlob(JSON.stringify(data, null, 2), "chat-everywhere-backup.json", "application/json");
    toast("Backup downloaded");
  });

  function downloadDataUrl(dataUrl, filename) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Initial state.
  loadMessages();
  loadMedia();
  loadNotes();
  loadShares();
  loadTheme();
})();