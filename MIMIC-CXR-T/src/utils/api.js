import axios from 'axios';

function config(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function findSentence(selectedTranslatedSentenceId) {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/translatedsentences/${selectedTranslatedSentenceId}`,
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

export async function getPreviousSuggestion(translatedsentenceId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/suggestions/${translatedsentenceId}`,  config(token),
  );
  return response.data;
}

export async function getPreviousUserCorrections(translatedSentenceId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/corrections/user/translatedsentence/${translatedSentenceId}`,  config(token),
  );
  return response.data;
}

export async function getPreviousUserTranslatedSentence(translatedsentenceId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedsentences/${translatedsentenceId}`,  config(token),
  );
  return response.data;
}

export async function getUserTranslatedSentencesByReportGroup(groupId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedsentences/countTotal/${groupId}`,  config(token),
  );
  return response.data;
}

export async function createSuggestion(selectedTranslatedSentenceId, modalText, editedTranslatedSentence, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/suggestions`, {
    translatedSentenceId: selectedTranslatedSentenceId,
    comments: modalText,
    changesFinalTranslation: editedTranslatedSentence,
  },  config(token),
  );
  return response.data;
}

export async function createCorrection(correctionData, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/corrections`, {
    translatedSentenceId: correctionData.translatedSentenceId,
    wordSelected: correctionData.wordSelected,
    wordIndex: correctionData.wordIndex,
  errorType: correctionData.errorType
  },  config(token),
  );
  return response.data;
}

export async function createUserTranslatedSentence(translatedsentenceId, isSelectedCheck, isSelectedTimes, token) {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedsentences/${translatedsentenceId}`, {
    translatedsentenceId,
    isSelectedCheck,
    isSelectedTimes,
  },  config(token),
  );
  return response.data;
}

export async function updateUserTranslatedSentence(translatedsentenceId, isSelectedCheck, isSelectedTimes, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedsentences/update/${translatedsentenceId}`, {
    translatedsentenceId,
    isSelectedCheck,
    isSelectedTimes,
  },  config(token),
  );
  return response.data;
}

export async function updateCorrection(translatedsentenceId, selectedOptions, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/corrections/update/${translatedsentenceId}`, {
    selectedOptions: selectedOptions.sort().join(', '),
  },  config(token),
  );
  return response.data;
}

export async function updateSuggestion(translatedsentenceId, modalText, editedTranslatedSentence, token) {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/suggestions/update/${translatedsentenceId}`, {
    text: modalText,
    changesFinalTranslation: editedTranslatedSentence,
  },  config(token),
  );
  return response.data;
}

export async function deleteCorrection(correcctionId, token) {
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/corrections/delete/${correcctionId}`,  config(token),
  );
  return response.data;
}

export async function deleteUserCorrectionsTranslatedSentence(translatedsentenceId, token) {
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/corrections/delete/user/${translatedsentenceId}`,  config(token),
  );
  return response.data;
}
 
export async function deleteSuggestion(translatedsentenceId, token) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/suggestions/${translatedsentenceId}`,  config(token),
    );
  return response.data;
}

export async function getTranslatedSentenceById(translatedsentenceId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/translatedsentences/${translatedsentenceId}`,  config(token),
  );
  return response.data;
}

export async function updateUserReportGroupProgress(progressTranslatedSentences, reportGroupId, token) {
  const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/userreportgroups/updateprogressTranslatedSentences/${reportGroupId}`, {
    progressTranslatedSentences}, config(token),
  );
  return response.data;
}

export async function updateReportProgress(progressReports, reportGroupId, token) {
  const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/userreportgroups/updateprogressReports/${reportGroupId}`, {
    progressReports}, config(token),
  );
  return response.data;
}

export async function getUserReportGroup(reportGroupId, token) {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/userreportgroups/user/${reportGroupId}`, config(token),
  );
  return response.data;
}

export async function getAllReportGroupReports(token){
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reportgroupreports`, config(token),
  );
  return response.data;
}

export async function createReportGroups(reportgroup, token){
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reportgroups`, {
    name: reportgroup.name,
    reportIds: reportgroup.reportIds,
  }, config(token),
  );
  return response.data;
}

export async function createUserReportGroups(userReportGroupData, token){
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/userreportgroups`, {
    reportGroupId: userReportGroupData.reportGroupId,
    userIds: userReportGroupData.userIds,
  }, config(token),
  );
  return response.data;
}

export async function getAllUsers(){
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`,
  );
  return response.data;
}

export async function deleteUser(userId, token){
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/delete/${userId}`, config(token),
  );
  return response.data;
}

export async function deleteReportGroupReport(reportGroupReportId, token){
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/reportgroupreports/${reportGroupReportId}`, config(token),
  );
  return response.data;
}

export async function createReportBatch(fileContent, token){
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reports`, {
    jsonContent: JSON.parse(fileContent)},  config(token)
  );
  return response.data;
}

export async function checkIsReportCompleted(reportId, token){
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/usertranslatedsentences/completed/${reportId}`, config(token),
  );
  return response.data;
}

export async function getReportById(reportId, token){
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reports/${reportId}`, config(token),
  );
  return response.data;
}

