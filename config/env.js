export const inProduction = process.NODE_ENV === "production";
export const urlApi = inProduction ?'':"http://localhost:3000/";