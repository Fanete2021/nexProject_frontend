export const convertObjectToArray = (obj: object) => {
  return Object.entries(obj).map(([key, value]) => ({
    id: key,
    ...value
  }));
};
