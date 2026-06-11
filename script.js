const STORAGE_KEY = "gta_friends_players";

const defaultPlayers = [
    { id: 1001, name: "GhostRider_LS", platform: "PC", level: 210, role: "Ветеран", about: "Все хеисты, микрофон есть, помогаю новичкам.", tags: ["🔫 хили","🎙️ микрофон"], social: "GhostRider", subscription: "Есть подписка" },
    { id: 1002, name: "PS_Sergio", platform: "PlayStation", level: 88, role: "Опытный", about: "Ищу тиму для кайо перико, есть PS Plus Premium.", tags: ["🎧 mic","💎 ограбления"], social: "Sergio_PSN", subscription: "Есть подписка" },
    { id: 1003, name: "Xbox_Crazy", platform: "Xbox", level: 45, role: "Новичок", about: "Только начал, есть Game Pass Core, ищу друзей", tags: ["🆕 новичок","🤝 дружелюбный"], social: "CrazyXbox", subscription: "Есть подписка" },
    { id: 1004, name: "NoPass_Rider", platform: "PlayStation", level: 112, role: "Гонщик", about: "Подписка PS Plus закончилась на месяц", tags: ["🏎️ гонки","⏳ ожидание"], social: "RiderNoPlus", subscription: "Временная" },
    { id: 1005, name: "FreeGrinder", platform: "PC", level: 67, role: "Фармер", about: "Фарм на складах, подписка не нужна на ПК", tags: ["💰 фарм","📈 бизнес"], social: "GrinderPC", subscription: "Нет подписки" },
    { id: 1006, name: "VenomPVP", platform: "PC", level: 198, role: "PVP", about: "Deathmatch, снайперки. Ищу сквад", tags: ["⚔️ агрессив","🎯 меткий"], social: "VenomPVP", subscription: "Нет подписки" },
    { id: 1007, name: "Niko_Bellic", platform: "Xbox", level: 312, role: "Ветеран", about: "Ищу брата по оружию", tags: ["💥 хеисты","🏆 элита"], social: "NikoX360", subscription: "Есть подписка" }
];

function loadPlayers() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            let parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length) return parsed;
        } catch(e) {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPlayers));
    return [...defaultPlayers];
}

let players = loadPlayers();

function savePlayers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

function generateId() {
    return players.length ? Math.max(...players.map(p => p.id)) + 1 : 5000;
}

function addPlayer(newPlayer) {
    players.push(newPlayer);
    savePlayers();
    renderFilteredPlayers();
}

function getPlatformClass(platform) {
    if (platform === "PC") return "pc";
    if (platform === "PlayStation") return "playstation";
    if (platform === "Xbox") return "xbox";
    return "";
}

function getPlatformIcon(platform) {
    if (platform === "PC") return "💻";
    if (platform === "PlayStation") return "🎮";
    return "🕹️";
}

function getSubIcon(sub) {
    if (sub === "Есть подписка") return "✅ активная";
    if (sub === "Нет подписки") return "❌ нет";
    return "⏳ временная";
}

function getRoleIcon(role) {
    const map = {
        "Новичок": "🌱 Новичок",
        "Опытный": "⚙️ Опытный",
        "Ветеран": "🔥 Ветеран",
        "Гонщик": "🏎️ Гонщик",
        "PVP": "💥 PVP",
        "Фармер": "💰 Фермер"
    };
    return map[role] || role;
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderFilteredPlayers() {
    const nameFilter = document.getElementById('filterName').value.trim().toLowerCase();
    const platformFilter = document.getElementById('filterPlatform').value;
    const roleFilter = document.getElementById('filterRole').value;
    const subFilter = document.getElementById('filterSubscription').value;

    let filtered = players.filter(p => {
        if (nameFilter && !p.name.toLowerCase().includes(nameFilter)) return false;
        if (platformFilter !== "all" && p.platform !== platformFilter) return false;
        if (roleFilter !== "all" && p.role !== roleFilter) return false;
        if (subFilter !== "all" && p.subscription !== subFilter) return false;
        return true;
    });

    document.getElementById('playersCount').innerText = filtered.length;
    const container = document.getElementById('playersGrid');

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">😔 Никого не найдено. Добавьте свою анкету!</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => {
        const platformClass = getPlatformClass(p.platform);
        const platformIcon = getPlatformIcon(p.platform);
        const subIcon = getSubIcon(p.subscription);
        const tagsHtml = p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
        
        return `
            <div class="player-card ${platformClass}">
                <div class="card-header">
                    <div class="avatar">${p.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="player-name">${escapeHtml(p.name)}</div>
                        <div>
                            <span class="platform-badge ${platformClass}">${platformIcon} ${p.platform}</span>
                            <span class="sub-badge">🎫 ${subIcon}</span>
                        </div>
                    </div>
                </div>
                <div class="detail-row">
                    <span class="tag">⭐ Уровень ${p.level}</span>
                    <span class="tag">🏆 ${getRoleIcon(p.role)}</span>
                </div>
                <div class="detail-row">${tagsHtml}</div>
                <div class="detail-row">
                    <span style="font-size:0.8rem; color:#b8e1fc;">📢 ${escapeHtml(p.about.length > 75 ? p.about.substring(0,75)+"..." : p.about)}</span>
                </div>
                <button class="btn-addfriend" data-social="${escapeHtml(p.social)}" data-name="${escapeHtml(p.name)}" data-platform="${p.platform}">
                    🤝 Добавить в друзья (${escapeHtml(p.social)})
                </button>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.btn-addfriend').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const social = btn.getAttribute('data-social');
            const name = btn.getAttribute('data-name');
            const platform = btn.getAttribute('data-platform');
            let hint = platform === "PlayStation" ? "PSN" : (platform === "Xbox" ? "Xbox Live" : "Social Club");
            alert(`✨ Найди ${name} через ${hint}\n🎮 ID: ${social}\nДобавляй и договаривайся о сессии!`);
        });
    });
}

function addFromForm() {
    const name = document.getElementById('newName').value.trim();
    if (!name) {
        alert("Введите никнейм!");
        return;
    }

    const newPlayer = {
        id: generateId(),
        name: name,
        platform: document.getElementById('newPlatform').value,
        subscription: document.getElementById('newSubscription').value,
        role: document.getElementById('newRole').value,
        level: parseInt(document.getElementById('newLevel').value) || 50,
        about: document.getElementById('newAbout').value.trim() || "Ищу тиммейтов!",
        tags: document.getElementById('newTags').value.split(',').map(t => t.trim()).filter(t => t),
        social: document.getElementById('newSocial').value.trim() || name
    };

    if (newPlayer.tags.length === 0) newPlayer.tags = ["🎮 GTA Online"];
    addPlayer(newPlayer);

    document.getElementById('newName').value = "";
    document.getElementById('newAbout').value = "";
    document.getElementById('newTags').value = "";
    document.getElementById('newSocial').value = "";
    document.getElementById('newLevel').value = "50";
    alert(`✅ Игрок ${name} добавлен! Теперь его видят все пользователи этого браузера.`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderFilteredPlayers();

    document.getElementById('filterName').addEventListener('input', renderFilteredPlayers);
    document.getElementById('filterPlatform').addEventListener('change', renderFilteredPlayers);
    document.getElementById('filterRole').addEventListener('change', renderFilteredPlayers);
    document.getElementById('filterSubscription').addEventListener('change', renderFilteredPlayers);
    document.getElementById('refreshListBtn').addEventListener('click', () => {
        players = loadPlayers();
        renderFilteredPlayers();
    });
    document.getElementById('submitPlayerBtn').addEventListener('click', addFromForm);
});
