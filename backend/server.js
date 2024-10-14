require('dotenv').config();
const app = require('./app');
console.log("")
const PORT = process.env.PORT || 4000;

console.log(process.env.TEST)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
