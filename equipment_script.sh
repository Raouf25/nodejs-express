#!/bin/bash

check_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo >&2 "I require $1 but it's not installed."
    echo >&2 "Installation : $2"
    echo >&2 "Aborting."
    exit 1
  }
}

check_command "curl" "https://everything.curl.dev/get"
check_command "jq" "https://stedolan.github.io/jq/"


api_url="http://localhost:3000/equipements"

# Envoyer la requête HTTP et stocker la réponse JSON dans un fichier temporaire
curl -s $api_url > equipements.json
cat equipements.json

 jq -r '.[].id' equipements.json | sort | uniq > equipements_ids.json
 jq -r '.[].etat' equipements.json | sort | uniq > equipements_etats.json

# Nombre de secondes à exécuter le code (3 minutes = 180 secondes)
total_seconds=180

while [ $total_seconds -gt 0 ]; do
  # Obtenir une valeur aléatoire d'identifiant (random_id)
  random_id=$(shuf -n 1 equipements_ids.json)

  # Obtenir une valeur aléatoire d'état (random_etat)
  random_etat=$(shuf -n 1 equipements_etats.json)

  echo -e "\nRandom ID: $random_id" " Random Etat: $random_etat"

  curl -s --location --request PUT "$api_url/$random_id" \
  --header "Content-Type: application/json" \
  --data "{
      \"etat\": \"$random_etat\"
  }"

  # Attendre une seconde avant la prochaine exécution
  sleep 1

  # Décrémenter le compteur de secondes
  total_seconds=$((total_seconds - 1))
done

# Supprimer les fichiers temporaires
rm  equipements.json equipements_ids.json equipements_etats.json
