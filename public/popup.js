// =========================
//  STORAGE
// =========================
async function storageGet(keys) {
    return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

async function storageSet(items) {
    return new Promise(resolve => chrome.storage.local.set(items, resolve));
}

// =========================
//  COMPARISONS
// =========================
const comparisons = {
    co2: [
        {
            label: 'driving by car',
            convert: g => `${Math.round(g / 120 * 1000)}m`,
        },
        {
            label: 'a lightbulb on',
            convert: g => formatTime(g / 5 * 3600),
        },
        {
            label: 'a kettle boiling',
            convert: g => formatTime(g / (3000 / 1000 * 233 / 3600)),
        },
    ],
    energy: [
        {
            label: 'charging your phone',
            convert: wh => formatTime(wh / 15 * 3600),
        },
        {
            label: 'running a desk fan',
            convert: wh => formatTime(wh / 25 * 3600),
        },
        {
            label: 'an LED bulb on',
            convert: wh => formatTime(wh / 8 * 3600),
        },
    ],
    water: [
        {
            label: 'a running shower',
            convert: ml => formatTime(ml / 80),
        },
        {
            label: 'a dripping tap',
            convert: ml => formatTime(ml / 1),
        },
        {
            label: 'toilet flushes',
            convert: ml => `${(ml / 6000).toFixed(2)} flushes`,
        },
    ],
};

const totalComparisons = {
    co2: {
        label: 'km by car',
        convert: g => (g / 120).toFixed(2),
    },
    energy: {
        label: 'phone charges',
        convert: wh => (wh / 15).toFixed(1),
    },
    water: {
        label: 'water bottles (500ml)',
        convert: l => (l * 1000 / 500).toFixed(1),
    },
};

function getExample(type, value) {
    const list = comparisons[type];
    const [a, b] = [...list].sort(() => Math.random() - 0.5).slice(0, 2);
    return `Like <strong>${a.convert(value)}</strong> of ${a.label}, or <strong>${b.convert(value)}</strong> of ${b.label}.`;
}

function getTotalExample(type, value) {
    const ex = totalComparisons[type];
    return `≈ ${ex.convert(value)} ${ex.label}`;
}

function formatTime(seconds) {
    if (seconds < 60) return `${Math.round(seconds)} second${Math.round(seconds) !== 1 ? 's' : ''}`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minute${Math.round(seconds / 60) !== 1 ? 's' : ''}`;
    return `${(seconds / 3600).toFixed(1)} hours`;
}
function drawBars(selector, data, color) {
    const container = document.querySelector(selector);
    if (!container) return;
    if (!data || !Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<p style="font-size:11px; color:#888;">No data yet</p>`;
        return;
    }

    const max = Math.max(...data);
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    container.innerHTML = data.map((v, i) => {
        const heightPct = max > 0 ? Math.round((v / max) * 100) : 0;
        const isToday = i === data.length - 1;
        return `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; justify-content:flex-end; height:60px;">
                <div style="width:100%; height:${heightPct}%; background:${isToday ? color : color + '55'}; border-radius:3px 3px 0 0; min-height:2px;"></div>
                <span style="font-size:9px; color:#888;">${days[i]}</span>
            </div>`;
    }).join('');
}

// =========================
//  TAB BUILDERS
// =========================
function createCo2Tab(data) {
    const counts = document.querySelectorAll('.co2-info .usage-count');
    counts[0].innerHTML = `${data.daily_co2_current.toFixed(2)}<span class="unit"> g Co<sub>2</sub></span>`;
    counts[1].innerHTML = `${data.weekly_co2_current.toFixed(2)}<span class="unit"> g Co<sub>2</sub></span>`;
    counts[2].innerHTML = `${data.monthly_co2_current.toFixed(2)}<span class="unit"> g Co<sub>2</sub></span>`;
    document.querySelector('.co2-info .example').innerHTML = getExample('co2', data.daily_co2_current);
    drawBars('.co2-info .graph-container', data.daily_co2_history, '#7c523a');
}

function createEnergyTab(data) {
    const counts = document.querySelectorAll('.energy-info .usage-count');
    counts[0].innerHTML = `${data.daily_energy_current.toFixed(4)}<span class="unit"> Wh</span>`;
    counts[1].innerHTML = `${data.weekly_energy_current.toFixed(4)}<span class="unit"> Wh</span>`;
    counts[2].innerHTML = `${data.monthly_energy_current.toFixed(4)}<span class="unit"> Wh</span>`;
    document.querySelector('.energy-info .example').innerHTML = getExample('energy', data.daily_energy_current);
    drawBars('.energy-info .graph-container', data.daily_energy_history, '#c07c1a');
}

function createWaterTab(data) {
    // stored in litres, display in ml for daily/weekly, litres for monthly
    const counts = document.querySelectorAll('.water-info .usage-count');
    counts[0].innerHTML = `${(data.daily_water_current * 1000).toFixed(1)}<span class="unit"> ml</span>`;
    counts[1].innerHTML = `${(data.weekly_water_current * 1000).toFixed(1)}<span class="unit"> ml</span>`;
    counts[2].innerHTML = `${data.monthly_water_current.toFixed(3)}<span class="unit"> L</span>`;
    document.querySelector('.water-info .example').innerHTML = getExample('water', data.daily_water_current * 1000);
    drawBars('.water-info .graph-container', data.daily_water_history, '#1a7ca0');
}

function createTotalTab(data) {
    const rows = document.querySelectorAll('.total-info .total-row');
    const toggle = document.querySelector('.ball-wrapper')
    const ball = document.querySelector('.ball')
    const toggleText = document.querySelector('.data-toggle-text')
    const isSharing = data.data_sharing

    rows[0].querySelector('.total-usage').innerHTML = `${data.total_co2_output_g.toFixed(1)} <span>g</span>`;
    rows[0].querySelector('.total-equals').innerHTML = getTotalExample('co2', data.total_co2_output_g);

    rows[1].querySelector('.total-usage').innerHTML = `${data.total_energy_consumption_wh.toFixed(3)} <span>Wh</span>`;
    rows[1].querySelector('.total-equals').innerHTML = getTotalExample('energy', data.total_energy_consumption_wh);

    rows[2].querySelector('.total-usage').innerHTML = `${data.total_water_consumption_l.toFixed(3)} <span>L</span>`;
    rows[2].querySelector('.total-equals').innerHTML = getTotalExample('water', data.total_water_consumption_l);

    document.querySelector('.prompt-count').textContent = data.prompt_counter ?? 0;

    toggleText.textContent = isSharing ? 'enabled' : 'disabled';
    if (isSharing) {
        ball.classList.remove('disabled');
    } else {
        ball.classList.add('disabled');
    }

    toggle.addEventListener('click', async () => {
        const stored = await storageGet(['data_sharing']);
        const current = stored.data_sharing ?? false;  // assume `false` if missing
        const newState = !current;

        await storageSet({ data_sharing: newState });

        // Update UI to reflect new state
        toggleText.textContent = newState ? 'enabled' : 'disabled';
        if (newState) {
            ball.classList.remove('disabled');
        } else {
            ball.classList.add('disabled');
        }
    });
}

// =========================
//  TAB SWITCHING
// =========================
const panels = {
    'co2-btn': document.querySelector('.co2-info'),
    'energy-btn': document.querySelector('.energy-info'),
    'water-btn': document.querySelector('.water-info'),
    'total-btn': document.querySelector('.total-info'),
};

const svgs = {
    'co2-btn': document.querySelector('#air'),
    'energy-btn': document.querySelector('#energy'),
    'water-btn': document.querySelector('#water'),
    'total-btn': document.querySelector('#logo'),
};

document.querySelectorAll('.buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.buttons button').forEach(b => b.classList.remove('active'));
        Object.values(panels).forEach(p => p.classList.remove('active'));
        ['logo', 'energy', 'water', 'air'].forEach(id => {
            document.querySelector(`#${id}`)?.classList.remove('active');
        });
        btn.classList.add('active');
        panels[btn.id].classList.add('active');
        svgs[btn.id]?.classList.add('active');
    });
});



// =========================
//  INIT
// =========================
async function init() {
    const data = await storageGet([
        'total_co2_output_g', 'total_energy_consumption_wh', 'total_water_consumption_l',
        'daily_co2_current', 'weekly_co2_current', 'monthly_co2_current',
        'daily_energy_current', 'weekly_energy_current', 'monthly_energy_current',
        'daily_water_current', 'weekly_water_current', 'monthly_water_current',
        'daily_co2_history', 'daily_energy_history', 'daily_water_history',
        'prompt_counter', 'data_sharing'
    ]);

    // fallback for users who existed before history arrays were added
    if (!data.daily_co2_history) data.daily_co2_history = [data.daily_co2_current ?? 0];
    if (!data.daily_energy_history) data.daily_energy_history = [data.daily_energy_current ?? 0];
    if (!data.daily_water_history) data.daily_water_history = [data.daily_water_current ?? 0];

    createCo2Tab(data);
    createEnergyTab(data);
    createWaterTab(data);
    createTotalTab(data);
}

init();