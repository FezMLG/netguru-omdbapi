declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OMDB_TOKEN: string;
      NODE_ENV: 'development' | 'production' | 'test' | 'local';
      JWT_SECRET: any;
      DB_CONNECTION: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}