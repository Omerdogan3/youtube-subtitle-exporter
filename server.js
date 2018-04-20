const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const textImporter = require('./youtube/textImporter');

app.get('/:query', (req, res) => {
  textImporter(req.params.query).then((result)=>{
    res.send({ express: result });
  });
  
});

app.listen(port, () => console.log(`Listening on port ${port}`));
