function parseTime(str) {
    // try parsing as unix timestamp
    if (/^\d+$/.test(str)) {
        const num = parseInt(str);
        if (num > 1000000000) {
            return new Date(num * 1000);
        }
        return new Date(num);
    }

    // try ISO format
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
        return date;
    }

    return null;
}

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

    displayResults(times);
});

function displayResults(times) {
    times.sort((a, b) => a - b);

    const output = document.getElementById('output');
    output.innerHTML = '<h2>Results</h2>';

    const list = document.createElement('ul');
    times.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t.toISOString();
        list.appendChild(li);
    });

    output.appendChild(list);
}