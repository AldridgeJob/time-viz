function parseTime(str) {
    // try parsing as unix timestamp
    if (/^\d+$/.test(str)) {
        const num = parseInt(str);
        if (num > 1000000000) {
            return new Date(num * 1000);
        }
        return new Date(num);
    }

    // millisecond timestamp
    if (/^\d{13}$/.test(str)) {
        return new Date(parseInt(str));
    }

    // try ISO format
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
        return date;
    }

    return null;
}

function displayResults(times) {
    times.sort((a, b) => a - b);

    const output = document.getElementById('output');
    output.innerHTML = '<h2>Results</h2>';

    // stats
    const stats = document.createElement('div');
    stats.className = 'stats';
    const duration = times[times.length-1] - times[0];
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    stats.innerHTML = `
        <p>Total entries: ${times.length}</p>
        <p>First: ${times[0].toLocaleString()}</p>
        <p>Last: ${times[times.length-1].toLocaleString()}</p>
        <p>Duration: ${days} days</p>
    `;
    output.appendChild(stats);

    // timeline visualization
    const timeline = createTimeline(times);
    output.appendChild(timeline);

    // list view
    const list = document.createElement('ul');
    times.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t.toISOString();
        list.appendChild(li);
    });

    output.appendChild(list);
}

function createTimeline(times) {
    const container = document.createElement('div');
    container.className = 'timeline';

    const min = times[0].getTime();
    const max = times[times.length - 1].getTime();
    const range = max - min;

    times.forEach(t => {
        const marker = document.createElement('div');
        marker.className = 'marker';
        const pos = ((t.getTime() - min) / range) * 100;
        marker.style.left = pos + '%';
        marker.title = t.toLocaleString();
        container.appendChild(marker);
    });

    return container;
}

let currentData = null;

document.getElementById('visualizeBtn').addEventListener('click', () => {
    const input = document.getElementById('timeInput').value;
    const lines = input.split('\n').filter(l => l.trim());

    const times = [];
    for (const line of lines) {
        const t = parseTime(line.trim());
        if (t) {
            times.push(t);
        }
    }

    if (times.length === 0) {
        alert('No valid timestamps found');
        return;
    }

    currentData = times;
    displayResults(times);
    document.getElementById('exportSection').style.display = 'block';
});

document.getElementById('exportCsv').addEventListener('click', () => {
    if (!currentData) return;

    let csv = 'timestamp,iso_string,unix_timestamp\n';
    currentData.forEach(t => {
        csv += `${t.getTime()},${t.toISOString()},${Math.floor(t.getTime()/1000)}\n`;
    });

    downloadFile(csv, 'times.csv', 'text/csv');
});

document.getElementById('exportJson').addEventListener('click', () => {
    if (!currentData) return;

    const data = currentData.map(t => ({
        timestamp: t.getTime(),
        iso: t.toISOString(),
        unix: Math.floor(t.getTime()/1000)
    }));

    downloadFile(JSON.stringify(data, null, 2), 'times.json', 'application/json');
});

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}