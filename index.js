const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());

// Utilize uma variável de ambiente para segurança
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "token_padrao_teste";
const PORT = process.env.PORT || 3000;

// Rota de verificação para a Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("Webhook validado com sucesso!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Rota para receber os status das mensagens
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;

    if (changes?.statuses) {
      const status = changes.statuses[0];
      console.log(`Número: ${status.recipient_id} | Status: ${status.status}`);
      
      if (status.status === "failed") {
        console.log("Erro detalhado:", status.errors?.[0]);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => console.log(`Servidor online na porta ${PORT}`));
