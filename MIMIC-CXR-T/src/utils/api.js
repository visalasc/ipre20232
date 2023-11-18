import axios from 'axios';

function config(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function findOriginalPhrase(selectedTranslatedPhraseId, token) {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/translatedphrases/tphrase/${selectedTranslatedPhraseId}`, config(token),
    ); 
    return response.data;
}

export async function getReportGroupsReportsByUser(token) { 
  const response = await axios.get(
  `${import.meta.env.VITE_BACKEND_URL}/reportgroupsreports/user`, config(token),
  );
  return response.data;
}

export async function getReportGroupsByUser(token) { 
  const response = await axios.get(
  `${import.meta.env.VITE_BACKEND_URL}/reportgroups/user`, config(token),
  );
  return response.data;
}

export async function getReportGroupReports(groupId, token) { 
  const response = await axios.get(
  `${import.meta.env.VITE_BACKEND_URL}/reportgroupreports/${groupId}`, config(token),
  );
  return response.data;
}

export async function getPreviousSuggestion(translatedphraseId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/suggestions/${translatedphraseId}`,  config(token),
  );
  return response.data;
}

export async function getPreviousCorrection(translatedphraseId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/corrections/${translatedphraseId}`,  config(token),
  );
  return response.data;
}

export async function getPreviousUserTranslatedPhrase(translatedphraseId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedphrases/${translatedphraseId}`,  config(token),
  );
  return response.data;
}

export async function getPreviousUserTranslatedPhraseByReport(translatedreportId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedphrases/translatedreport/${translatedreportId}`,  config(token),
  );
  return response.data;
}

export async function createCorrection(translatedphraseId, selectedOptions, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/corrections`, {
    translatedphraseId,
    selectedOptions: selectedOptions.sort().join(', '),
  },  config(token),
  );
  return response.data;
}

export async function createSuggestion(translatedphraseId, text, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/suggestions`, {
    translatedphraseId,
    text,
  },  config(token),
  );
  return response.data;
}

export async function createUserTranslatedPhrase(translatedphraseId, isSelectedCheck, isSelectedTimes, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedphrases/${translatedphraseId}`, {
    translatedphraseId,
    isSelectedCheck,
    isSelectedTimes,
  },  config(token),
  );
  return response.data;
}

export async function updateUserTranslatedPhrase(translatedphraseId, isSelectedCheck, isSelectedTimes, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedphrases/update/${translatedphraseId}`, {
    translatedphraseId,
    isSelectedCheck,
    isSelectedTimes,
  },  config(token),
  );
  return response.data;
}

export async function updateCorrection(translatedphraseId, selectedOptions, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/corrections/update/${translatedphraseId}`, {
    selectedOptions: selectedOptions.sort().join(', '),
  },  config(token),
  );
  return response.data;
}

export async function updateSuggestion(translatedphraseId, text, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/suggestions/update/${translatedphraseId}`, {
    text,
  },  config(token),
  );
  return response.data;
}

export async function deleteCorrection(translatedphraseId, token) {
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/corrections/${translatedphraseId}`,  config(token),
  );
  return response.data;
}

export async function deleteSuggestion(translatedphraseId, token) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/suggestions/${translatedphraseId}`,  config(token),
    );
  return response.data;
}

export async function getTranslatedPhraseById(translatedphraseId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/translatedphrases/${translatedphraseId}`,  config(token),
  );
  return response.data;
}

export async function updateUserReportGroupProgress(progress, reportGroupId, token) {
  const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/userreportgroups/updateprogress/${reportGroupId}`, {
    progress}, config(token),
  );
  return response.data;
}

export async function getUserReportGroup(reportGroupId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/userreportgroups/user/${reportGroupId}`, config(token),
  );
  return response.data;
}