export const httpStatus = {
	200: { id: "200", label: "OK", code: 200 },
	201: { id: "201", label: "Créé", code: 201 },
	204: { id: "204", label: "Aucun contenu", code: 204 },
	400: { id: "400", label: "Requête incorrecte", code: 400 },
	401: { id: "401", label: "Non autorisé", code: 401 },
	402: { id: "402", label: "Paiement requis", code: 402 },
	403: { id: "403", label: "Interdit", code: 403 },
	404: { id: "404", label: "Introuvable", code: 404 },
	406: { id: "406", code: 406 }, // no label since it's used to return a message to the client
	422: { id: "422", label: "Entité non processable", code: 422 },
	500: { id: "500", label: "Erreur interne du serveur", code: 500 },
	502: { id: "502", label: "Mauvaise passerelle", code: 502 },
	503: { id: "503", label: "Service indisponible", code: 503 },
} as const;
