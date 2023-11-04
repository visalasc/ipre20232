import axios from 'axios';

export async function getPreviousSuggestion(translatedphraseId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/suggestions/${translatedphraseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getPreviousCorrection(translatedphraseId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/corrections/${translatedphraseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createCorrection(translatedphraseId, selectedOptions, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/corrections`, {
    translatedphraseId,
    selectedOptions: selectedOptions.sort().join(', '),
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createSuggestion(translatedphraseId, text, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/suggestions`, {
    translatedphraseId,
    text,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createUserTranslatedPhrase(translatedphraseId, isSelectedCheck, isSelectedTimes, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedphrases`, {
    translatedphraseId,
    isSelectedCheck,
    isSelectedTimes,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateUserTranslatedPhrase(translatedphraseId, isSelectedCheck, isSelectedTimes, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedphrases`, {
    translatedphraseId,
    isSelectedCheck,
    isSelectedTimes,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateCorrection(translatedphraseId, selectedOptions, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/corrections/update/${translatedphraseId}`, {
    selectedOptions: selectedOptions.sort().join(', '),
  }, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateSuggestion(translatedphraseId, text, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/suggestions/update/${translatedphraseId}`, {
    text,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteCorrection(translatedphraseId, token) {
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/corrections/${translatedphraseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteSuggestion(translatedphraseId, token) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/suggestions/${translatedphraseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getUserTranslatedPhrasesForReport(reportId, userId, token) {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/usertranslatedphrases/${reportId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return response.data;
}

export async function getTranslatedPhraseById(translatedphraseId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/translatedphrases/${translatedphraseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
