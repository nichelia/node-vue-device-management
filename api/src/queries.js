const Pool = require('pg').Pool;
const Joi = require('joi');

const pool = new Pool({
  user: 'my_user',
  host: 'db',
  database: 'my_database',
  password: 'my_password',
  port: 5432,
});

const deviceSchema = Joi.object({
  model: Joi.string().required(),
  brand: Joi.string().required(),
  release_date: Joi.string()
    .optional()
    .pattern(/^\d{4}\/\d{2}$/)
    .when(Joi.exist(), {
      then: Joi.custom((value, helpers) => {
        const [year, month] = value.split('/');
        if (isNaN(year) || isNaN(month) || parseInt(month) < 1 || parseInt(month) > 12) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'custom validation'),
    }),
  os: Joi.string().optional(),
  is_new: Joi.boolean().optional(),
  received_datatime: Joi.date().optional(),
});

const getDevices = (request, response) => {
  pool.query('SELECT * FROM devices ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getDeviceById = (request, response) => {
  const id = request.params.id;

  pool.query('SELECT * FROM devices WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createDevice = (request, response) => {
  const { error, value } = deviceSchema.validate(request.body);

  if (error) {
    response.status(400).json({ error: error.details[0].message });
    return;
  }

  const { model, brand, release_date, os, is_new, received_datatime } = value;

  pool.query(
    'INSERT INTO devices (id, model, brand, release_date, os, is_new, received_datatime) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6) RETURNING *',
    [model, brand, release_date, os, is_new, received_datatime],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json(results.rows[0]);
    }
  );
};

const updateDevice = (request, response) => {
  const { error, value } = deviceSchema.validate(request.body);

  if (error) {
    response.status(400).json({ error: error.details[0].message });
    return;
  }

  const id = request.params.id;
  const { model, brand, release_date, os, is_new, received_datatime } = value;

  pool.query(
    'UPDATE devices SET model = $1, brand = $2, release_date = $3, os = $4, is_new = $5, received_datatime = $6, update_datetime = NOW() WHERE id = $7',
    [model, brand, release_date, os, is_new, received_datatime, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows[0]);
    }
  );
};

const deleteDevice = (request, response) => {
  const id = request.params.id;

  pool.query('DELETE FROM devices WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Device deleted with ID: ${id}`);
  });
};

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};