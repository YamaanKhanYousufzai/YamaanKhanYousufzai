const navButtons = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.tab-panel');

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    navButtons.forEach((b) => b.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

const subjectData = [
  { name: 'Math', state: 'behind', color: 'red', detail: 'Backlog 6 tasks. Next: algebra drill.' },
  { name: 'Physics', state: 'at risk', color: 'yellow', detail: '2 chapters pending. Add revision block tonight.' },
  { name: 'English', state: 'fine', color: 'green', detail: 'On track. Keep 20-minute reading streak.' }
];

const tasks = [
  { title: 'Math worksheet Q1–Q5', time: '25 min', difficulty: '⭐⭐', urgency: 'red', type: 'Main' },
  { title: 'Physics formulas recap', time: '20 min', difficulty: '⭐', urgency: 'yellow', type: 'Main' },
  { title: 'English essay outline', time: '30 min', difficulty: '⭐⭐⭐', urgency: 'red', type: 'Main' },
  { title: 'Biology flashcards', time: '15 min', difficulty: '⭐', urgency: 'gray', type: 'Optional' },
  { title: 'History quick revise', time: '12 min', difficulty: '⭐', urgency: 'gray', type: 'Optional' }
];

const nextActions = {
  beginner: [
    'Open notes and read 5 lines (3 min).',
    'Solve 1 question only (5 min).',
    'Watch a 3-minute explanation video.'
  ],
  normal: [
    'Complete section 2 of your assignment (20 min).',
    'Revise chapter summary and write 3 key points.',
    'Finish one pending school task before break.'
  ],
  advanced: [
    'Do a timed mock set: 5 questions in 15 min.',
    'Review mistakes from your last test and fix 2.',
    'Write your own mini-quiz and solve it.'
  ]
};

function renderTodayBoard() {
  const board = document.getElementById('today-board');
  board.innerHTML = '';
  tasks.forEach((task) => {
    const el = document.createElement('article');
    el.className = `task ${task.urgency}`;
    el.innerHTML = `<h4>${task.title}</h4><small>${task.type} • ${task.time} • ${task.difficulty}</small>`;
    board.appendChild(el);
  });
}

function renderSubjectStrip() {
  const strip = document.getElementById('subject-strip');
  const detail = document.getElementById('subject-detail');
  strip.innerHTML = '';
  subjectData.forEach((subject) => {
    const btn = document.createElement('button');
    btn.className = `pill ${subject.color}`;
    btn.textContent = `${subject.name} ${subject.color === 'red' ? '🔴' : subject.color === 'yellow' ? '🟡' : '🟢'} (${subject.state})`;
    btn.addEventListener('click', () => {
      detail.textContent = `${subject.name}: ${subject.detail}`;
    });
    strip.appendChild(btn);
  });
}

function renderWeek() {
  const view = document.getElementById('week-view');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  view.innerHTML = days
    .map(
      (day) => `<div class="day"><strong>${day}</strong><ul class="list compact"><li>🔴 3 priority tasks</li><li>🟡 1 revision task</li><li>⚪ 1 optional task</li></ul></div>`
    )
    .join('');
}

function renderSubjectMap() {
  const map = document.getElementById('subject-map');
  map.innerHTML = `
    <div class="row"><span>Math</span><span>62% • backlog 6 • trend hard</span></div>
    <div class="row"><span>Physics</span><span>54% • backlog 8 • trend unstable</span></div>
    <div class="row"><span>English</span><span>84% • backlog 1 • trend steady</span></div>
  `;
}

document.getElementById('next-action-btn').addEventListener('click', () => {
  const mode = document.getElementById('mode').value;
  const options = nextActions[mode];
  const pick = options[Math.floor(Math.random() * options.length)];
  document.getElementById('next-action-output').textContent = pick;
});

let reminderCount = 0;
document.getElementById('remind-later').addEventListener('click', () => {
  reminderCount += 1;
  const detail = document.getElementById('crisis-detail');
  if (reminderCount >= 2) {
    detail.textContent = 'Reminder limit reached. Start now for 5 minutes.';
    return;
  }
  detail.textContent = `Okay, reminder snoozed (${reminderCount}/2). It will come back soon.`;
});

document.getElementById('break-steps').addEventListener('click', () => {
  document.getElementById('crisis-detail').textContent = 'Step 1: open notes (2m), Step 2: solve 2 questions (10m), Step 3: self-check (3m).';
});

document.getElementById('start-now').addEventListener('click', () => {
  document.querySelector('[data-target="focus"]').click();
});

document.getElementById('generate-plan').addEventListener('click', () => {
  const output = document.getElementById('plan-output');
  output.innerHTML = [
    'Day 1: Math micro-task + Physics revision + 20 min buffer',
    'Day 2: English draft + Chemistry flashcards + buffer',
    'Day 3: Math mock + Physics formulas + recap',
    'Day 4: Assignment finalization + weak-topic review',
    'Day 5: Full revision block + backlog clearance',
    'Day 6: Mock exam + mistake review',
    'Day 7: Light recap + deadline submission checks'
  ]
    .map((x) => `<li>${x}</li>`)
    .join('');
});

const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('focus-progress');
const focusState = document.getElementById('focus-state');
const recoveryCard = document.getElementById('recovery-card');
let sessionHandle;
let totalSeconds = 0;
let remaining = 0;
let pulses = 0;

function endSession() {
  clearInterval(sessionHandle);
  sessionHandle = null;
  focusState.textContent = 'Session completed. Recovery mode unlocked.';
  recoveryCard.classList.add('show');
}

function tick() {
  remaining -= 1;
  const done = totalSeconds - remaining;
  const pct = Math.max(0, Math.min(100, (done / totalSeconds) * 100));
  progressEl.style.width = `${pct}%`;

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  timerEl.textContent = `${mm}:${ss}`;

  if (remaining % 20 === 0 && remaining > 0) {
    pulses += 1;
    const msg = pulses === 1 ? 'Soft vibration warning.' : pulses === 2 ? 'Visual pulse warning.' : 'Sound alert warning.';
    focusState.textContent = `${msg} Emergency pause available.`;
  }

  if (remaining <= 0) {
    timerEl.textContent = '00:00';
    endSession();
  }
}

function startSession(mins) {
  clearInterval(sessionHandle);
  recoveryCard.classList.remove('show');
  pulses = 0;
  totalSeconds = mins * 60;
  remaining = totalSeconds;
  progressEl.style.width = '0%';
  timerEl.textContent = `${String(mins).padStart(2, '0')}:00`;
  focusState.textContent = 'Focus lock active. Everything else hidden.';
  sessionHandle = setInterval(tick, 1000);
}

document.querySelectorAll('.session').forEach((btn) => {
  btn.addEventListener('click', () => startSession(Number(btn.dataset.mins)));
});

document.getElementById('pause-emergency').addEventListener('click', () => {
  if (!sessionHandle) return;
  clearInterval(sessionHandle);
  sessionHandle = null;
  focusState.textContent = 'Paused in emergency mode. Resume by selecting a session.';
});

document.getElementById('finish-session').addEventListener('click', () => {
  if (!sessionHandle) return;
  endSession();
});

document.querySelectorAll('.profile-mode').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.profile-mode').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const detail = document.getElementById('profile-detail');
    if (btn.dataset.profile === 'lazy') detail.textContent = 'Extra guidance enabled: tasks are smaller and reminders are stronger.';
    if (btn.dataset.profile === 'balanced') detail.textContent = 'Balanced pacing: moderate task sizes and normal reminder intensity.';
    if (btn.dataset.profile === 'discipline') detail.textContent = 'High challenge mode: larger tasks, fewer hints, strict pacing.';
  });
});

document.getElementById('reduce-task').addEventListener('click', () => {
  const breakdown = document.getElementById('task-breakdown');
  breakdown.innerHTML = `
    <li>Research — 5 min</li>
    <li>Outline bullets — 7 min</li>
    <li>Draft one paragraph — 12 min</li>
    <li>Quick check — 5 min</li>
  `;
});

renderTodayBoard();
renderSubjectStrip();
renderWeek();
renderSubjectMap();
