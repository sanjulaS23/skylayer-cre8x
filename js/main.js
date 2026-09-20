// Simple screen router
function showScreen(screenId) {
  document.body.classList.toggle('cover-mode', screenId === 'cover');

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    if (screenId !== 'cover' && n.dataset.screen === screenId) {
      n.classList.add('active');
    }
  });

  // Re-initialize icons after switching
  lucide.createIcons();
}

let toastTimer;

function showToast(message) {
  const toast = document.getElementById('toast');
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

// Bottom nav click handlers
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const screenId = item.dataset.screen;
    showScreen(screenId);
  });
});

// Intro cover action
document.getElementById('getStartedBtn').addEventListener('click', () => {
  showScreen('home');
});

// Travel style selection
document.querySelectorAll('.style-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.style-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

// SkySense predictive routing demo
const predictionStates = [
  {
    title: 'Leave in 12 min for the calmest sky route',
    text: 'SkySense predicts lighter air traffic and a clear rooftop transfer.'
  },
  {
    title: 'A shaded route opens in 8 min',
    text: 'The next rooftop shuttle reduces outdoor walking by 420 m.'
  },
  {
    title: 'Avoid a 6 min delay at WTC',
    text: 'SkySense found a quieter elevator and a one-stop air connection.'
  }
];

const refreshPrediction = document.getElementById('refreshPrediction');
const predictionTitle = document.getElementById('predictionTitle');
const predictionText = document.getElementById('predictionText');
let predictionIndex = 0;

refreshPrediction?.addEventListener('click', () => {
  predictionIndex = (predictionIndex + 1) % predictionStates.length;
  const nextPrediction = predictionStates[predictionIndex];
  predictionTitle.textContent = nextPrediction.title;
  predictionText.textContent = nextPrediction.text;
  refreshPrediction.classList.add('is-spinning');
  window.setTimeout(() => refreshPrediction.classList.remove('is-spinning'), 420);
});

const accessibilityPreference = document.getElementById('accessibilityPreference');
const accessibilityLabel = accessibilityPreference?.querySelector('strong');
const accessibilityModes = ['Step-free priority', 'Low-sensory route', 'Shade-first route'];
let accessibilityIndex = 0;

accessibilityPreference?.addEventListener('click', () => {
  accessibilityIndex = (accessibilityIndex + 1) % accessibilityModes.length;
  accessibilityLabel.textContent = accessibilityModes[accessibilityIndex];
  accessibilityPreference.setAttribute('aria-pressed', accessibilityIndex !== 0 ? 'true' : 'false');
  accessibilityPreference.classList.toggle('is-active', accessibilityIndex !== 0);
});

const smartRebook = document.getElementById('smartRebook');
const rebookLabel = document.getElementById('rebookLabel');
let rebookingEnabled = false;

smartRebook?.addEventListener('click', () => {
  rebookingEnabled = !rebookingEnabled;
  rebookLabel.textContent = rebookingEnabled ? 'Auto-protect is on' : 'Protect this journey';
  smartRebook.classList.toggle('is-active', rebookingEnabled);
  smartRebook.setAttribute('aria-pressed', rebookingEnabled ? 'true' : 'false');
});

// Accessible travel preferences
const comfortStatus = document.getElementById('comfortStatus');
const comfortOptions = document.querySelectorAll('.comfort-option');

comfortOptions.forEach(option => {
  option.addEventListener('click', () => {
    const comfortMode = option.dataset.comfort;
    const isSelected = option.getAttribute('aria-pressed') === 'true';
    const nextState = !isSelected;

    option.setAttribute('aria-pressed', nextState ? 'true' : 'false');

    if (comfortMode === 'large-text') {
      document.body.classList.toggle('large-text', nextState);
    }

    if (comfortMode === 'quiet') {
      document.body.classList.toggle('quiet-mode', nextState);
    }

    if (comfortMode === 'step-free') {
      document.querySelectorAll('.filter-chip').forEach(chip => {
        if (chip.textContent.includes('Step-free')) {
          chip.classList.toggle('active', nextState);
        }
      });
    }

    const selectedModes = [...comfortOptions]
      .filter(item => item.getAttribute('aria-pressed') === 'true')
      .map(item => item.querySelector('span').textContent.toLowerCase());

    comfortStatus.textContent = selectedModes.length
      ? `${selectedModes.join(' + ')} selected for your next route`
      : 'No preferences selected';
  });
});

const accessibilitySettings = document.querySelectorAll('.accessibility-toggle');

accessibilitySettings.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const mode = toggle.dataset.access;
    const isSelected = toggle.getAttribute('aria-pressed') === 'true';
    const nextState = !isSelected;

    toggle.setAttribute('aria-pressed', nextState ? 'true' : 'false');
    toggle.classList.toggle('is-active', nextState);

    if (mode === 'large-text') {
      document.body.classList.toggle('large-text', nextState);
    }

    if (mode === 'quiet-mode') {
      document.body.classList.toggle('quiet-mode', nextState);
    }

    if (mode === 'high-contrast') {
      document.body.classList.toggle('high-contrast', nextState);
    }

    showToast(`${toggle.querySelector('span').textContent} ${nextState ? 'enabled' : 'disabled'}.`);
  });
});

document.getElementById('profileHelpBtn')?.addEventListener('click', () => {
  showToast('Travel assistance requested. A guide can help with the next step.');
});

// Search routes (demo: go to route screen)
document.querySelector('.search-btn').addEventListener('click', () => {
  const from = document.getElementById('from');
  const to = document.getElementById('to');

  if (!from.value.trim() || !to.value.trim()) {
    showToast('Add a starting point and destination to find a route.');
    (from.value.trim() ? to : from).focus();
    return;
  }

  showScreen('route');
  showToast('Route ready. Review your journey details.');
});

// Quick trip cards (demo: go to route screen)
document.querySelectorAll('.trip-card').forEach(card => {
  card.addEventListener('click', () => {
    showScreen('route');
  });
});

// AI route comparison
const routeExplanations = {
  calm: 'AI pick: the calmest route today, based on predicted air traffic and elevator wait times.',
  accessible: 'Best for confidence: every transfer is step-free, with an extra three minutes built in.',
  walk: 'Best for low walking: this option saves 240 m outdoors by using a closer rooftop connection.'
};

const routeExplanation = document.getElementById('routeExplanation');

document.querySelectorAll('.route-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.route-option').forEach(item => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-pressed', 'false');
    });

    option.classList.add('is-selected');
    option.setAttribute('aria-pressed', 'true');
    routeExplanation.textContent = routeExplanations[option.dataset.route];
    showToast(`${option.querySelector('strong').textContent} route selected.`);
  });
});

// Start Journey (demo: go to map screen)
document.querySelector('.btn-primary').addEventListener('click', () => {
  showScreen('map');
  showToast('Live journey tracking started.');
});

// Route actions
document.querySelector('.alt-btn').addEventListener('click', event => {
  event.currentTarget.textContent = 'Alternative selected';
  showToast('Alternative route selected: all ground, 32 min.');
});

document.querySelector('.help-btn').addEventListener('click', () => {
  showToast('Help is ready. A mobility guide would contact you here.');
});

const saveRouteButton = document.querySelector('.btn-secondary');
const savedEmptyState = document.getElementById('savedEmptyState');
const savedRouteCard = document.getElementById('savedRouteCard');

saveRouteButton.addEventListener('click', () => {
  savedEmptyState.classList.add('is-hidden');
  savedRouteCard.classList.remove('is-hidden');
  showToast('Route saved. You can resume it from Saved.');
});

document.getElementById('resumeSavedRoute').addEventListener('click', () => {
  showScreen('route');
  showToast('Saved route reopened.');
});

document.getElementById('removeSavedRoute').addEventListener('click', () => {
  savedRouteCard.classList.add('is-hidden');
  savedEmptyState.classList.remove('is-hidden');
  showToast('Saved route removed.');
});

document.querySelector('.language-selector').addEventListener('click', event => {
  const language = event.currentTarget.querySelector('span');
  language.textContent = language.textContent === 'EN' ? 'SI' : 'EN';
  showToast(`Language set to ${language.textContent}.`);
});

// 2D/3D toggle (visual only)
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});