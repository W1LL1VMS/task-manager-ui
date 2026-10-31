// Transforme une erreur Axios en message lisible pour l'utilisateur
export function getErrorMessage(err) {
  if (err.response?.data?.error) return err.response.data.error;
  if (err.request) return "Impossible de joindre le serveur. Vérifie que l'API est lancée.";
  return "Une erreur inattendue est survenue.";
}