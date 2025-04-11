enum types {
    EMAIL = 'email',
    PHONE = 'phone'
}

export const getInputType = (value: string): types | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{7,14}$/;

  if (emailRegex.test(value)) return types.EMAIL;
  if (phoneRegex.test(value)) return types.PHONE;
  return null;
};
