// auth.js
const SERVER_URL = 'https://casinoaqua-server.onrender.com';

function getToken() {
  return localStorage.getItem('token');
}

async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${SERVER_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data && data.success) {
      localStorage.setItem('userBalance', String(data.user.balance || 0));
      return data.user;
    }
  } catch (e) {
    console.error('getCurrentUser error', e);
  }
  return null;
}

// --- tärkeä osa: käytetään /play ---
async function saveGamePlay(game, bet, win) {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${SERVER_URL}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ game, bet, win })
    });
    const data = await res.json();
    if (data && data.success) {
      const newBalance = data.user.balance;
      // Päivitä UI ja localStorage
      const el = document.getElementById('profileBalance');
      if (el) el.innerText = newBalance;
      localStorage.setItem('userBalance', String(newBalance));
      window.dispatchEvent(new CustomEvent('balanceUpdated', { detail: { balance: newBalance } }));
      return data.user;
    } else {
      console.warn('saveGamePlay failed', data);
      return null;
    }
  } catch (e) {
    console.error('saveGamePlay error', e);
    return null;
  }
}

// eksporttaa globaalisti
window.getCurrentUser = getCurrentUser;
window.saveGamePlay = saveGamePlay;
