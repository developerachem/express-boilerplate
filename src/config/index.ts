import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd() + "/.env") });

interface DeepFreezeObject {
  [key: string]: string | number | DeepFreezeObject;
}

function deepFreeze<T>(obj: T): T {
  if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      const value = (obj as unknown as DeepFreezeObject)[key];
      if (
        typeof value === "object" &&
        value !== null &&
        !Object.isFrozen(value)
      ) {
        deepFreeze(value);
      }
    });
    return Object.freeze(obj);
  }
  return obj;
}

export default deepFreeze({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  db: {
    uri:
      (process.env.DB_USER &&
        process.env.DB_PASSWORD &&
        (process.env.DB_URI?.replace("<username>", process.env.DB_USER).replace(
          "<db_password>",
          process.env.DB_PASSWORD
        ) as string)) ||
      "",
  },
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND as string,
});
