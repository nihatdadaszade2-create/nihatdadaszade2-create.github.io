// ===== Tərcümələr (AZ / EN) =====
const i18n = {
    en: {
        nav_services: 'Services', nav_projects: 'Projects', nav_pricing: 'Pricing', nav_contact: 'Contact',
        hero_badge: 'Available for new projects',
        hero_title: 'Websites with <em>AI chatbots</em> and automation for your business',
        hero_lead: 'I build fast websites that answer customer questions 24/7 and send every lead straight to your Telegram or email.',
        hero_cta1: 'Get a free consultation', hero_cta2: 'See my work',
        services_title: 'What I do',
        s1_title: 'Business website', s1_text: 'Fast, mobile-friendly sites for restaurants, salons and schools. Menu, prices, map, WhatsApp button.',
        s2_title: 'AI chatbot', s2_text: 'An assistant on your site that answers common questions (prices, hours, location) automatically.',
        s3_title: 'Automation', s3_text: 'Form submissions go instantly to Telegram, Google Sheets and email. No lead gets lost.',
        projects_title: 'Projects',
        p1_text: 'Movie portal: genre filter, search, sign-up modals and a payment UI (demo).',
        p2_title: 'Salon chatbot', p2_text: 'Try the assistant in the bottom-right corner — a live demo running on this page.',
        p3_title: 'Lead automation', p3_text: 'In progress: automatic Telegram notifications from a website form.',
        soon: 'Coming soon',
        process_title: 'How we work',
        st1_t: '1. Call', st1: 'Free 15-minute call to understand your needs.',
        st2_t: '2. Design', st2: 'First version ready in 2–3 days.',
        st3_t: '3. Revisions', st3: 'Changes based on your feedback.',
        st4_t: '4. Launch', st4: 'Site goes live and I show you how to use it.',
        pricing_title: 'Packages',
        pr1_amount: 'from $90', pr1_a: 'One-page website', pr1_b: 'Mobile-friendly', pr1_c: 'WhatsApp button',
        popular: 'Popular',
        pr2_amount: 'from $200', pr2_a: 'Up to 5 pages', pr2_b: 'AI chatbot', pr2_c: 'Form → Telegram',
        pr3_amount: 'Custom quote', pr3_a: 'Custom automation', pr3_b: 'CRM / Sheets integration', pr3_c: 'Monthly support',
        contact_title: 'Have a project?', contact_text: 'Message me — I reply within 24 hours.',
        f_name: 'Your name', f_contact: 'Phone or email', f_msg: 'What do you need?', f_send: 'Send',
        f_ok: 'Your message is ready.', f_wa: 'Send via WhatsApp',
        bot_name: 'Glow Salon assistant (demo)', bot_ph: 'Type your question...'
    },
    az: {} // HTML-dəki orijinal mətnlər avtomatik bura yığılır
};

let lang = 'az';
try { lang = localStorage.getItem('lang') || 'az'; } catch (e) {}
// ?lang=en linki ilə açılanda dil birbaşa seçilir (Upwork üçün)
const urlLang = new URLSearchParams(location.search).get('lang');
if (urlLang === 'en' || urlLang === 'az') lang = urlLang;

// Orijinal AZ mətnlərini yadda saxla
document.querySelectorAll('[data-i18n]').forEach(el => { i18n.az[el.dataset.i18n] = el.innerHTML; });
document.querySelectorAll('[data-i18n-ph]').forEach(el => { i18n.az[el.dataset.i18nPh] = el.placeholder; });
i18n.az.f_ok = 'Mesajınız hazırdır.';
i18n.az.f_wa = 'WhatsApp ilə göndər';

function applyLang() {
    const dict = i18n[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if (dict[el.dataset.i18n]) el.innerHTML = dict[el.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        if (dict[el.dataset.i18nPh]) el.placeholder = dict[el.dataset.i18nPh];
    });
    document.getElementById('langBtn').textContent = lang === 'az' ? 'EN' : 'AZ';
}

document.getElementById('langBtn').addEventListener('click', () => {
    lang = lang === 'az' ? 'en' : 'az';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    applyLang();
    resetChat();
});

// ===== Əlaqə forması =====
// Hələlik mesajı WhatsApp-a yönləndirir. Sonra n8n / Telegram bot ilə əvəz edəcəyik.
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const text = `Ad: ${data.get('name')}\nƏlaqə: ${data.get('contact')}\nMesaj: ${data.get('message')}`;
    const phone = '994552453207';
    const note = document.getElementById('formNote');
    const link = document.createElement('a');
    link.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'btn btn-primary';
    link.textContent = i18n[lang].f_wa;
    note.textContent = i18n[lang].f_ok + ' ';
    note.appendChild(link);
    e.target.reset();
});

// ===== Demo chatbot =====
// Qaydaya əsaslanan bot. Real layihədə bu cavabları Claude API verəcək.
const bot = {
    az: {
        hello: 'Salam! 👋 Glow Salon-un köməkçisiyəm. Qiymətlər, iş saatları və ya ünvan haqqında soruşa bilərsiniz.',
        quick: ['Qiymətlər', 'İş saatları', 'Ünvan', 'Növbə al'],
        rules: [
            { k: ['qiym', 'neçə', 'nece', 'pul', 'manat', 'azn'], a: 'Qiymətlərimiz:\n• Saç kəsimi — 15 AZN\n• Manikür — 20 AZN\n• Saç boyama — 40 AZN-dən' },
            { k: ['saat', 'açıq', 'acik', 'iş vaxt', 'qrafik'], a: 'Hər gün 10:00–20:00 açığıq. Bazar günü 11:00–18:00.' },
            { k: ['ünvan', 'unvan', 'harada', 'yer', 'xəritə'], a: 'Ünvan: Bakı, Nizami küçəsi 10 (demo ünvan).' },
            { k: ['növbə', 'novbe', 'yazıl', 'yazil', 'rezerv', 'qeyd'], a: 'Növbə üçün adınızı və istədiyiniz saatı yazın — administrator sizə zəng edəcək. 📅' },
            { k: ['salam', 'hi', 'hello'], a: 'Salam! Sizə necə kömək edə bilərəm?' },
            { k: ['sağ ol', 'sag ol', 'təşəkkür', 'tesekkur'], a: 'Dəymədi! Gözəl gün arzulayırıq ✨' }
        ],
        fallback: 'Bu sualı administratora ötürürəm. Hələlik qiymətlər, iş saatları və ya ünvan haqqında soruşa bilərsiniz.'
    },
    en: {
        hello: 'Hi! 👋 I\'m the Glow Salon assistant. Ask me about prices, opening hours or location.',
        quick: ['Prices', 'Hours', 'Location', 'Book'],
        rules: [
            { k: ['price', 'cost', 'how much'], a: 'Our prices:\n• Haircut — $9\n• Manicure — $12\n• Hair coloring — from $24' },
            { k: ['hour', 'open', 'time'], a: 'Open daily 10:00–20:00. Sunday 11:00–18:00.' },
            { k: ['location', 'address', 'where'], a: 'Address: 10 Nizami St, Baku (demo address).' },
            { k: ['book', 'appointment', 'reserve'], a: 'Send your name and preferred time — our admin will call you. 📅' },
            { k: ['hi', 'hello', 'hey'], a: 'Hello! How can I help?' },
            { k: ['thank'], a: 'You\'re welcome! Have a lovely day ✨' }
        ],
        fallback: 'I\'ll pass this to our admin. Meanwhile, ask me about prices, hours or location.'
    }
};

const chat = document.getElementById('chat');
const chatBody = document.getElementById('chatBody');
const chatQuick = document.getElementById('chatQuick');
const chatText = document.getElementById('chatText');

function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = `msg ${who}`;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
}

function reply(question) {
    const q = question.toLowerCase();
    const b = bot[lang];
    const rule = b.rules.find(r => r.k.some(k => q.includes(k)));
    const typing = addMsg('...', 'bot typing');
    setTimeout(() => {
        typing.remove();
        addMsg(rule ? rule.a : b.fallback, 'bot');
    }, 600);
}

function send(text) {
    if (!text.trim()) return;
    addMsg(text, 'user');
    reply(text);
}

function resetChat() {
    chatBody.innerHTML = '';
    chatQuick.innerHTML = '';
    addMsg(bot[lang].hello, 'bot');
    bot[lang].quick.forEach(label => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.onclick = () => send(label);
        chatQuick.appendChild(btn);
    });
}

document.getElementById('chatToggle').onclick = () => {
    chat.hidden = !chat.hidden;
    if (!chat.hidden) chatText.focus();
};
document.getElementById('chatClose').onclick = () => { chat.hidden = true; };
document.getElementById('chatForm').addEventListener('submit', e => {
    e.preventDefault();
    send(chatText.value);
    chatText.value = '';
});

applyLang();
resetChat();
