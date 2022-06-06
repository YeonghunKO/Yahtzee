const getItem = (key, defaultValue) => {
  const res = localStorage.getItem(key);
  if (res) {
    return JSON.parse(res);
  } else {
    return defaultValue;
  }
};

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export { getItem, setItem };
