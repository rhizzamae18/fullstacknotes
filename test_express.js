import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('ok'));
app.listen(3006, () => console.log('running on 3006'));
