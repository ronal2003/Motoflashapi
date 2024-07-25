import express from 'express';
import 'express-async-errors';
const app = express();
const port = 3000;
import * as middleware from './middlewares/middlewares.js';

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from './routes/routesUsers.js';
import driverRoutes from './routes/routesDrivers.js';

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['http://localhost:5173']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);

app.use(middleware.handleNotFound);
app.use(middleware.handleServerError);

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
