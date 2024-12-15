export const excludeSensitiveFields = <T>(data: T, fieldsToExclude: (keyof T)[]): Partial<T> => {
  const sanitizedData = { ...data };
  fieldsToExclude.forEach((field) => {
    delete sanitizedData[field];
  });
  return sanitizedData;
};
