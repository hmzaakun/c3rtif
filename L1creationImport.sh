#!/usr/bin/env bash
set -e

if ! command -v avalanche &> /dev/null
then
    echo "avalanche-cli est introuvable. Veuillez l'installer."
    exit 1
fi

# Création de la blockchain "esgi"
avalanche blockchain import file export-esgi.json --force

echo "[OK] Blockchain 'esgi' créée avec succès."

avalanche blockchain deploy esgi --local

echo "[OK] Blockchain 'esgi' déployée avec succès."
