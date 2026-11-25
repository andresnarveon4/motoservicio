import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API de MotoServicio",
      version: "1.0.0",
      description: "API para gestionar categorías, clientes y pedidos.",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/server.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

// app.use(cors({
//   origin: "http://localhost:5173",
// }));

app.use(express.json());
/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 */
app.get("/api/categorias", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre FROM categorias ORDER BY id",
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar categorías" });
  }
});

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   apellido_paterno:
 *                     type: string
 *                   apellido_materno:
 *                     type: string
 *                     nullable: true
 *                   telefono:
 *                     type: string
 *                     nullable: true
 *                   direccion:
 *                     type: string
 *                     nullable: true
 *                   correo:
 *                     type: string
 *                     nullable: true
 */
app.get("/api/clientes", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, apellido_paterno, apellido_materno, telefono, direccion, correo
       FROM clientes
       ORDER BY id`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar clientes" });
  }
});

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtener pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos con información de cliente, categoría, estado y repartidor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   cliente_id:
 *                     type: integer
 *                   cliente:
 *                     type: string
 *                   categoria_id:
 *                     type: integer
 *                   categoria:
 *                     type: string
 *                   estado_id:
 *                     type: integer
 *                   estado:
 *                     type: string
 *                   estado_color:
 *                     type: string
 *                     nullable: true
 *                   repartidor_id:
 *                     type: integer
 *                   repartidor:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                     nullable: true
 *                   direccion_origen:
 *                     type: string
 *                     nullable: true
 *                   direccion_destino:
 *                     type: string
 *                     nullable: true
 *                   precio:
 *                     type: number
 */
app.get("/api/pedidos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        pedidos.id,
        pedidos.cliente_id,
        CONCAT_WS(' ', clientes.nombre, clientes.apellido_paterno, clientes.apellido_materno) AS cliente,
        pedidos.categoria_id,
        categorias.nombre AS categoria,
        pedidos.repartidor_id,
        CONCAT_WS(' ', repartidores.nombre, repartidores.apellido_paterno, repartidores.apellido_materno) AS repartidor,
        pedidos.estado_id,
        estados.nombre AS estado,
        estados.color AS estado_color,
        pedidos.descripcion,
        pedidos.direccion_origen,
        pedidos.origen_lat,
        pedidos.origen_lng,
        pedidos.direccion_destino,
        pedidos.destino_lat,
        pedidos.destino_lng,
        pedidos.distancia_km,
        pedidos.duracion_min,
        pedidos.precio,
        pedidos.creado_en
      FROM pedidos
      JOIN clientes ON clientes.id = pedidos.cliente_id
      JOIN categorias ON categorias.id = pedidos.categoria_id
      JOIN estados ON estados.id = pedidos.estado_id
      JOIN repartidores ON repartidores.id = pedidos.repartidor_id
      ORDER BY pedidos.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar pedidos" });
  }
});

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *               - categoria_id
 *               - repartidor_id
 *               - direccion_destino
 *               - precio
 *             properties:
 *               cliente_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               repartidor_id:
 *                 type: integer
 *               estado_id:
 *                 type: integer
 *                 description: Opcional; si se omite, usa el estado Pendiente
 *               descripcion:
 *                 type: string
 *               direccion_origen:
 *                 type: string
 *               origen_lat:
 *                 type: number
 *               origen_lng:
 *                 type: number
 *               direccion_destino:
 *                 type: string
 *               destino_lat:
 *                 type: number
 *               destino_lng:
 *                 type: number
 *               distancia_km:
 *                 type: number
 *               duracion_min:
 *                 type: integer
 *               precio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Faltan campos obligatorios o no existe el estado Pendiente
 *       500:
 *         description: Error al crear el pedido
 */
app.post("/api/pedidos", async (req, res) => {
  const {
    cliente_id,
    categoria_id,
    repartidor_id,
    estado_id,
    descripcion,
    direccion_origen,
    origen_lat,
    origen_lng,
    direccion_destino,
    destino_lat,
    destino_lng,
    distancia_km,
    duracion_min,
    precio,
  } = req.body;

  if (
    !cliente_id ||
    !categoria_id ||
    !repartidor_id ||
    !direccion_destino ||
    precio === undefined
  ) {
    return res.status(400).json({
      error:
        "cliente_id, categoria_id, repartidor_id, direccion_destino y precio son obligatorios",
    });
  }

  try {
    let pedidoEstadoId = estado_id;

    if (!pedidoEstadoId) {
      const estado = await pool.query(
        "SELECT id FROM estados WHERE nombre = 'Pendiente' LIMIT 1",
      );

      pedidoEstadoId = estado.rows[0]?.id;
    }

    if (!pedidoEstadoId) {
      return res.status(400).json({
        error: "No existe un estado pendiente",
      });
    }

    const result = await pool.query(
      `INSERT INTO pedidos (
        cliente_id,
        categoria_id,
        repartidor_id,
        estado_id,
        descripcion,
        direccion_origen,
        origen_lat,
        origen_lng,
        direccion_destino,
        destino_lat,
        destino_lng,
        distancia_km,
        duracion_min,
        precio
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        cliente_id,
        categoria_id,
        repartidor_id,
        pedidoEstadoId,
        descripcion,
        direccion_origen,
        origen_lat,
        origen_lng,
        direccion_destino,
        destino_lat,
        destino_lng,
        distancia_km,
        duracion_min,
        precio,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
});

app.listen(port, () => {
  console.log(`Backend disponible en http://localhost:${port}`);
});
