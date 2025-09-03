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
      // synkataan localStorage myös (kätevä muille välilehdille)
      localStorage.setItem('userBalance', String(data.user.balance || 0));
      return data.user;
    }
  } catch (e) {
    console.error('getCurrentUser error', e);
  }
  return null;
}

async function updateBalance(newBalance) {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${SERVER_URL}/update-balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ balance: Number(newBalance) })
    });
    const data = await res.json();
    if (data && data.success) {
      // Päivitä paikallinen UI jos elementti löytyy
      const el = document.getElementById('profileBalance');
      if (el) el.innerText = Number(newBalance);
      // säilytä myös localStoragessa jotta muut välilehdet kuulee muutoksen
      localStorage.setItem('userBalance', String(Number(newBalance)));
      // lähetä custom event
      window.dispatchEvent(new CustomEvent('balanceUpdated', { detail: { balance: Number(newBalance) } }));
      return true;
    } else {
      console.warn('updateBalance failed', data);
      return false;
    }
  } catch (e) {
    console.error('updateBalance error', e);
    return false;
  }
}

async function saveGamePlay(game, bet, win) {
  const token = getToken();
  if (!token) return false;
  try {
    await fetch(`${SERVER_URL}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ game, bet, win })
    });
    return true;
  } catch (e) {
    console.error('saveGamePlay error', e);
    return false;
  }
}

// eksporttaa funktiot globaalisti (ei module)
window.getCurrentUser = getCurrentUser;
window.updateBalance = updateBalance;
window.saveGamePlay = saveGamePlay;
