const https = require('https');

const loginData = JSON.stringify({
  username: 'testuser123',
  password: 'Password123!'
});

const req = https.request({
  hostname: 'test-intern-developer-eight.vercel.app',
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Login Response Status:', res.statusCode);
    console.log('Login Response Body:', data);
    console.log('Login Response Headers:', res.headers);
    const cookies = res.headers['set-cookie'];
    if (!cookies) {
      console.log('No cookie received!');
      return;
    }

    const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

    // Get tasks
    const todoReq = https.request({
      hostname: 'test-intern-developer-eight.vercel.app',
      path: '/Todolist',
      method: 'GET',
      headers: {
        'Cookie': cookieHeader
      }
    }, (todoRes) => {
      let todoData = '';
      todoRes.on('data', (chunk) => todoData += chunk);
      todoRes.on('end', () => {
        console.log('Todo Get Response Status:', todoRes.statusCode);
        console.log('Todo Get Response Body:', todoData);
      });
    });
    todoReq.end();
  });
});

req.write(loginData);
req.end();
