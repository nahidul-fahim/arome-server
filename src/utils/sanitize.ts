export const excludeSensitiveFields = <T extends object>(data: T, fieldsToExclude: (keyof T)[]): Partial<T> => {
  const sanitizedData = { ...data };
  fieldsToExclude.forEach((field) => {
    delete sanitizedData[field];
  });
  const finalData = Object.keys(sanitizedData);
  console.log(finalData);
  return sanitizedData;
};
