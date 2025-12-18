const http = require('http');

function post(path, data){
  return new Promise((resolve,reject)=>{
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res)=>{
      let body = '';
      res.on('data', chunk=> body += chunk);
      res.on('end', ()=> resolve({status: res.statusCode, body}));
    });

    req.on('error', (e)=> reject(e));
    req.write(payload);
    req.end();
  });
}

(async ()=>{
  try{
    const register = await post('/api/auth/register-student', {name: 'Test Student', phone: '0500000000', password: 'Pass1234'});
    console.log('REGISTER STATUS', register.status);
    console.log('REGISTER BODY', register.body);

    const login = await post('/api/auth/login', {phone: '0500000000', password: 'Pass1234'});
    console.log('LOGIN STATUS', login.status);
    console.log('LOGIN BODY', login.body);
  }catch(e){
    console.error('ERROR', e);
  }
})();