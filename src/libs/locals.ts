const locals = {
  set: (name: string, value: unknown) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(name, JSON.stringify(value));
  },
  get: (name: string) => {
    if (typeof window === "undefined") return undefined;
    const v = localStorage.getItem(name);
    if (!v) return undefined;
    return JSON.parse(v);
  },
  remove: (name: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
  },
};

export default locals;
