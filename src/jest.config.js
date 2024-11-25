module.exports = {

  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "types": ["jest", "node"],
    "skipLibCheck": true
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]


};