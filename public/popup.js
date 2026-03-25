const clamp = (
    value,
    min = 0,
    max = 1
) => {
    if (min > max) {
        [min, max] = [max, min];
    }

    return Math.max(min, Math.min(max, value));
};

const normalize = (
    number,
    currentScaleMin,
    currentScaleMax,
    newScaleMin = 0,
    newScaleMax = 1
) => {
    const standardNormalization =
        (number - currentScaleMin) / (currentScaleMax - currentScaleMin);

    return (newScaleMax - newScaleMin) * standardNormalization + newScaleMin;
};

const clampedNormalize = (
    value,
    currentScaleMin,
    currentScaleMax,
    newScaleMin = 0,
    newScaleMax = 1
) => {
    return clamp(
        normalize(
            value,
            currentScaleMin,
            currentScaleMax,
            newScaleMin,
            newScaleMax
        ),
        newScaleMin,
        newScaleMax
    );
};

function getDistanceBetweenPoints(p1, p2) {
    const deltaX = p1.x - p2.x;
    const deltaY = p1.y - p2.y;

    return Math.sqrt(deltaX ** 2 + deltaY ** 2);
}

const convertDegreesToRadians = (angle) =>
    (angle * Math.PI) / 180;
const convertRadiansToDegrees = (angle) =>
    (angle * 180) / Math.PI;

const convertPolarToCartesian = (angle, distance) => {
    const angleInRadians = convertDegreesToRadians(angle);

    const x = Math.cos(angleInRadians) * distance;
    const y = Math.sin(angleInRadians) * distance;

    return [x, y];
};

const convertCartesianToPolar = (x, y) => {
    let angle = convertRadiansToDegrees(Math.atan2(y, x));

    if (angle < 0) {
        angle += 360;
    }

    const distance = Math.sqrt(x ** 2 + y ** 2);

    return [angle, distance];
};


// --- DOM ---

const btns = document.querySelectorAll('.buttons button');
const prevCells = Array.from(document.querySelectorAll('.previous p')).slice(1);
const currCells = Array.from(document.querySelectorAll('.current p')).slice(1);
const timeUnitSpans = document.querySelectorAll('.time-unit');
const energyUnitSpans = document.querySelectorAll('.energy-unit');
const compPhrase = document.querySelector('.comp-phrase');
const totalOnly = document.querySelector('.total-only');
const compPhraseCont = document.querySelector('.comparison')


const KEYS = [
    'daily_co2_previous', 'daily_co2_current',
    'daily_energy_previous', 'daily_energy_current',
    'daily_water_previous', 'daily_water_current',
    'weekly_co2_previous', 'weekly_co2_current',
    'weekly_energy_previous', 'weekly_energy_current',
    'weekly_water_previous', 'weekly_water_current',
    'monthly_co2_previous', 'monthly_co2_current',
    'monthly_energy_previous', 'monthly_energy_current',
    'monthly_water_previous', 'monthly_water_current',
    'total_co2_output_g',
    'total_energy_consumption_wh',
    'total_water_consumption_l',
];

const TYPES = ['co2', 'energy', 'water']


// --- Grading ---

function cellGrader(prevArr, currArr, mode = null) {
    const prev = Number(prevArr[0].innerHTML.slice(0, -1));
    const curr = Number(currArr[0].innerHTML.slice(0, -1));
    const diff = ((curr - prev) / prev) * 100;

    currCells.forEach(cell => {
        cell.classList.remove('positive', 'negative');
        if (mode) {
            return;
        }
        else if (diff < 0) {
            const clampedDiff = clampedNormalize(diff, 0, -100, 0, 100);
            cell.style.setProperty('--brightness', clampedDiff + '%');
            cell.classList.add('positive');
        } else {
            const clampedDiff = clampedNormalize(diff, 0, 100, 0, 100);
            cell.style.setProperty('--brightness', clampedDiff + '%');
            cell.classList.add('negative');
        }
    });
}


// --- Comparison phrase ---

function getComparisonPhrase(current, previous, mode) {
    let timeUnit
    switch (mode) {
        case 'daily':
            timeUnit = 'yesterday'
            break;
        case 'weekly':
            timeUnit = 'last week'
            break;
        case 'monthly':
            timeUnit = 'last month'
            break;
    }
    if (previous === 0) return 'no previous data to compare';
    const diff = ((current - previous) / previous * 100).toFixed(1);
    if (diff > 0) return `${diff}% more than ${timeUnit}`;
    if (diff < 0) return `${Math.abs(diff)}% less than ${timeUnit}`;
    return `the same as ${timeUnit}`;
}

function getExamplePhrase(target, value) {
    switch (target) {
        case 'co2':
            return [
                'produced an amount of CO2 equal to',
                `driving a car for ${(value / 120).toFixed(1)} km`  // avg car emits ~120g co2/km
            ];
        case 'energy':
            return [
                'used an amount of energy equal to',
                `charging a smartphone ${(value / 11).toFixed(0)} times`  // avg charge ~0.012 Wh
            ];
        case 'water':
            return [
                'used an amount of water equal to',
                `${(value / 0.25).toFixed(0)} glasses of water`  // avg glass ~0.25L
            ];
    }
}


// --- View ---

function populateView(data, mode) {
    let i = Math.floor(Math.random() * TYPES.length);
    let target = TYPES[i];

    if (mode === 'total') {
        prevCells[0].textContent = '-';
        prevCells[1].textContent = '-';
        prevCells[2].textContent = '-';
        currCells[0].textContent = `${data.total_co2_output_g.toFixed(3) ?? 0} g`;
        currCells[1].textContent = `${data.total_energy_consumption_wh.toFixed(3) ?? 0} Wh`;
        currCells[2].textContent = `${data.total_water_consumption_l.toFixed(3) ?? 0} L`;
        timeUnitSpans[0].textContent = 'In total'
        totalOnly.textContent = 'have';
        compPhraseCont.classList.add('hidden')
        cellGrader(prevCells, currCells, 'total')

        switch (target) {
            case 'co2':
                [exampleSpanOne, exampleSpanTwo] = getExamplePhrase(target, data.total_co2_output_g.toFixed(3))
                break;
            case 'energy':
                [exampleSpanOne, exampleSpanTwo] = getExamplePhrase(target, data.total_energy_consumption_wh.toFixed(3))
                break;
            case 'water':
                [exampleSpanOne, exampleSpanTwo] = getExamplePhrase(target, data.total_water_consumption_l.toFixed(3))
                break;
        }

        energyUnitSpans[0].textContent = exampleSpanOne
        energyUnitSpans[1].textContent = exampleSpanTwo

        return;
    }

    const co2Prev = data[`${mode}_co2_previous`] ?? 0;
    const co2Curr = data[`${mode}_co2_current`] ?? 0;
    const energyPrev = data[`${mode}_energy_previous`] ?? 0;
    const energyCurr = data[`${mode}_energy_current`] ?? 0;
    const waterPrev = data[`${mode}_water_previous`] ?? 0;
    const waterCurr = data[`${mode}_water_current`] ?? 0;

    prevCells[0].textContent = `${co2Prev.toFixed(3)} g`;
    prevCells[1].textContent = `${energyPrev.toFixed(3)} Wh`;
    prevCells[2].textContent = `${waterPrev.toFixed(3)} L`;
    currCells[0].textContent = `${co2Curr.toFixed(3)} g`;
    currCells[1].textContent = `${energyCurr.toFixed(3)} Wh`;
    currCells[2].textContent = `${waterCurr.toFixed(3)} L`;



    switch (target) {
        case 'co2':
            [exampleSpanOne, exampleSpanTwo] = getExamplePhrase(target, co2Prev)
            break;
        case 'energy':
            [exampleSpanOne, exampleSpanTwo] = getExamplePhrase(target, energyPrev)
            break;
        case 'water':
            [exampleSpanOne, exampleSpanTwo] = getExamplePhrase(target, waterPrev)
            break;
    }



    switch (mode) {
        case 'daily':
            timeUnitSpans[0].textContent = 'Yesterday'
            timeUnitSpans[1].textContent = 'Today'
            energyUnitSpans[0].textContent = exampleSpanOne
            energyUnitSpans[1].textContent = exampleSpanTwo
            totalOnly.textContent = '';
            compPhraseCont.classList.remove('hidden')

            break;
        case 'weekly':
            timeUnitSpans[0].textContent = 'Last week'
            timeUnitSpans[1].textContent = 'This week'
            energyUnitSpans[0].textContent = exampleSpanOne
            energyUnitSpans[1].textContent = exampleSpanTwo
            totalOnly.textContent = '';
            compPhraseCont.classList.remove('hidden')

            break;
        case 'monthly':
            timeUnitSpans[0].textContent = 'Last month'
            timeUnitSpans[1].textContent = 'This month'
            energyUnitSpans[0].textContent = exampleSpanOne
            energyUnitSpans[1].textContent = exampleSpanTwo
            totalOnly.textContent = '';
            compPhraseCont.classList.remove('hidden')

            break;

    }

    compPhrase.textContent = getComparisonPhrase(co2Curr, co2Prev, mode);

    cellGrader(prevCells, currCells);
}


// --- Button active state ---

function setActiveButton(activeBtn) {
    btns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}


// --- Init ---

chrome.storage.local.get(KEYS, (data) => {
    populateView(data, 'daily');

    document.getElementById('daily-btn').addEventListener('click', (e) => {
        setActiveButton(e.target);
        populateView(data, 'daily');
    });
    document.getElementById('weekly-btn').addEventListener('click', (e) => {
        setActiveButton(e.target);
        populateView(data, 'weekly');
    });
    document.getElementById('monthly-btn').addEventListener('click', (e) => {
        setActiveButton(e.target);
        populateView(data, 'monthly');
    });
    document.getElementById('total-btn').addEventListener('click', (e) => {
        setActiveButton(e.target);
        populateView(data, 'total');
    });
});