const SERVER_URL = 'https://casinoaqua-server.onrender.com';

async function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const res = await fetch(`${SERVER_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) return data.user;
  } catch (e) {
    console.error("getCurrentUser error:", e);
  }
  return null;
}

async function updateBalance(newBalance) {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    await fetch(`${SERVER_URL}/update-balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ balance: newBalance })
    });
    // päivitä UI jos balance elementti löytyy
    const b = document.getElementById('profileBalance');
    if (b) b.innerText = newBalance;
    return true;
  } catch (e) {
    console.error("updateBalance error:", e);
    return false;
  }
// Lisää auth.js tiedostoon
async function saveGamePlay(game, bet, win){
  const token = localStorage.getItem('token');
  if(!token) return;

  try {
    await fetch(`${SERVER_URL}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bet, win, game })
    });
  } catch(err){
    console.error("Error saving game:", err);
  }
}



}
