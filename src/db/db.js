import postgres from 'postgres';

const conexion = postgres({
  host: 'postgresql-hugosdd.alwaysdata.net',
  user: 'hugosdd_ronal',
  password: 'ronal1234',
  database: 'hugosdd_moto',
  debug: true,
});

export default conexion;
