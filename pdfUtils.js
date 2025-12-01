import pdf from 'pdf-parse';

export const extractTextFromPdf = async (buffer) => {
  const data = await pdf(buffer);
  return data.text || '';
};
