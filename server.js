// server.js
const express = require('express');
 
const app = express();
const port = 3000;


const equipements = [
  { id: 1, nom: 'Equipement A', etat: 'on' },
  { id: 2, nom: 'Equipement B', etat: 'off' },
  { id: 3, nom: 'Equipement C', etat: 'on' },
  { id: 4, nom: 'Equipement D', etat: 'off' },
  { id: 5, nom: 'Equipement E', etat: 'on' },
  { id: 6, nom: 'Equipement F', etat: 'off' },
  { id: 7, nom: 'Equipement G', etat: 'on' },
  { id: 8, nom: 'Equipement H', etat: 'off' }
];

app.get('/equipements', (req, res) => {
  res.json(equipements); 
});


// Route pour obtenir la liste des équipements
app.get('/equipements-sse', (req, res) => {
 res.setHeader('Content-Type', 'text/event-stream')
 res.setHeader('Access-Control-Allow-Origin', '*')

 const intervalId = setInterval(()=>{
  const data = JSON.stringify(equipements);
  res.write(`data : ${data} \n`)
 },1000)

 res.on('close', ()=>{
  close.log('Client closed connection')
  clearInterval(intervalId)
  res.end()
 })

});

// Route pour obtenir un équipement par son ID
app.get('/equipements/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const equipement = equipements.find((e) => e.id === id);

  if (equipement) {
    res.json(equipement);
  } else {
    res.status(404).send('Equipement not found');
  }
});

// Route pour ajouter un nouvel équipement
app.post('/equipements', (req, res) => {
  const newEquipement = req.body;
  equipements.push(newEquipement);
  res.status(201).json(newEquipement);
});



app.use(express.json()) // parse json body content

app.put('/equipements/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = equipements.findIndex(equipement => equipement.id === id)
  if (index === -1) {
      return res.status(404).send('equipement not found')
  }
  const updatedEquipement = {
      id: equipements[index].id,
      nom: req.body.nom || equipements[index].nom, // Utiliser req.body.nom s'il existe, sinon utiliser equipements[index].nom
      etat: req.body.etat
  }
  equipements[index] = updatedEquipement
  res.status(200).json(equipements[index])
})

// Ajoutez cette route pour simuler les mises à jour aléatoires des équipements
app.get('/simulate-equipment-updates', (req, res) => {
  // Définissez la durée totale en secondes pendant laquelle vous souhaitez simuler les mises à jour
  const totalSeconds = 180;

  // Créez un tableau pour stocker les mises à jour d'équipements
  const updates = [];

  // Créez une fonction pour générer une mise à jour aléatoire de l'équipement
  function simulateEquipmentUpdate() {
    // Obtenez un identifiant d'équipement aléatoire
    const randomId = Math.floor(Math.random() * equipements.length) + 1;
    
    // Obtenez un état d'équipement aléatoire (on ou off)
    const randomEtat = Math.random() < 0.5 ? 'on' : 'off';

    // Mettez à jour l'équipement aléatoire avec le nouvel état
    const equipementIndex = equipements.findIndex(e => e.id === randomId);
    if (equipementIndex !== -1) {
      equipements[equipementIndex].etat = randomEtat;
    }

    // Ajoutez la mise à jour au tableau d'updates
    updates.push({ id: randomId, etat: randomEtat });
  }

  // Créez un intervalle pour simuler les mises à jour
  const updateInterval = setInterval(simulateEquipmentUpdate, 1000);

  // Arrêtez la simulation après la durée spécifiée
  setTimeout(() => {
    clearInterval(updateInterval);
    res.json({ updates });
  }, totalSeconds * 1000);
});



// Route pour supprimer un équipement par son ID
app.delete('/equipements/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const equipementIndex = equipements.findIndex((e) => e.id === id);

  if (equipementIndex !== -1) {
    equipements.splice(equipementIndex, 1);
    res.send('Equipement deleted');
  } else {
    res.status(404).send('Equipement not found');
  }
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

