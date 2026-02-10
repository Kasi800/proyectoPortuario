const request = require('supertest');

// Mock del servicio antes de cargar la app
jest.mock('../services/puertoService', () => ({
    getPuertos: jest.fn(),
    getPuertoById: jest.fn(),
    createPuerto: jest.fn(),
    updatePuerto: jest.fn(),
    deletePuerto: jest.fn()
}));

const puertoService = require('../services/puertoService');
const app = require('../app');

describe('API Puertos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/puertos', () => {
        test('debe devolver lista de puertos con estructura {rows, count}', async () => {
            const sampleRows = [
                { id_puerto: 1, nombre: 'Puerto A', ciudad: 'Valencia', pais: 'España', capacidad_teu: 1000, activo: true, fecha_inauguracion: '1970-01-01', profundidad_media: '12.50' },
                { id_puerto: 2, nombre: 'Puerto B', ciudad: 'Barcelona', pais: 'España', capacidad_teu: 2000, activo: false, fecha_inauguracion: '1980-02-02', profundidad_media: '10.00' }
            ];
            puertoService.getPuertos.mockResolvedValue({ rows: sampleRows, count: sampleRows.length });

            const res = await request(app).get('/api/puertos').expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toHaveProperty('rows');
            expect(res.body.data).toHaveProperty('count', 2);
            expect(Array.isArray(res.body.data.rows)).toBe(true);
            expect(res.body.data.rows[0]).toMatchObject({ nombre: 'Puerto A', ciudad: 'Valencia' });
        });

        test('debe devolver 400 para parámetros de query inválidos (limit=0)', async () => {
            const res = await request(app).get('/api/puertos?limit=0').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
            expect(res.body.data).toBeNull();
        });

        test('debe devolver 400 para offset negativo', async () => {
            const res = await request(app).get('/api/puertos?offset=-1').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });

        test('debe devolver 400 para order con campo no permitido', async () => {
            const res = await request(app).get('/api/puertos?order=noexiste:asc').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });

        test('debe devolver 400 para filtros con tipo incorrecto (capacidad_teu no entero)', async () => {
            const res = await request(app).get('/api/puertos?capacidad_teu=abc').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });

        test('debe devolver 400 si rango _min > _max', async () => {
            const res = await request(app).get('/api/puertos?capacidad_teu_min=100&capacidad_teu_max=10').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });

        test('debe devolver 400 para parámetro desconocido en query', async () => {
            const res = await request(app).get('/api/puertos?foo=bar').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/puertos/:id', () => {
        test('debe devolver un puerto por id con los campos esperados', async () => {
            const puerto = { id_puerto: 5, nombre: 'Puerto X', ciudad: 'Alicante', pais: 'España', capacidad_teu: 800000, activo: true, fecha_inauguracion: '1965-03-20', profundidad_media: '10.50' };
            puertoService.getPuertoById.mockResolvedValue(puerto);

            const res = await request(app).get('/api/puertos/5').expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toMatchObject({ id_puerto: 5, nombre: 'Puerto X', ciudad: 'Alicante' });
        });

        test('debe devolver 400 para id inválido 0', async () => {
            const res = await request(app).get('/api/puertos/0').expect(400);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Invalid identifier');
        });

        test('debe devolver 400 para id float como string (1.0)', async () => {
            const res = await request(app).get('/api/puertos/1.0').expect(400);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Invalid identifier');
        });

        test('debe devolver 400 para id no numérico', async () => {
            const res = await request(app).get('/api/puertos/abc').expect(400);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Invalid identifier');
        });

        test('debe devolver 404 si el servicio no encuentra el puerto', async () => {
            puertoService.getPuertoById.mockImplementation(() => { throw { status: 404, message: 'Puerto not found' }; });
            const res = await request(app).get('/api/puertos/9999').expect(404);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Puerto not found');
        });
    });

    describe('POST /api/puertos', () => {
        test('debe crear un puerto y devolver 201 con el objeto creado', async () => {
            const newPuerto = { nombre: 'Puerto Nuevo', ciudad: 'Tánger', pais: 'Marruecos', capacidad_teu: 6000000, activo: true, fecha_inauguracion: '2007-01-15', profundidad_media: 18.0 };
            const created = { id_puerto: 10, ...newPuerto };
            puertoService.createPuerto.mockResolvedValue(created);

            const res = await request(app)
                .post('/api/puertos')
                .send(newPuerto)
                .set('Content-Type', 'application/json')
                .expect(201);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toMatchObject({ id_puerto: 10, nombre: 'Puerto Nuevo' });
        });

        test('debe propagar error 400 cuando el servicio lanza un ApiError de validación', async () => {
            puertoService.createPuerto.mockImplementation(() => { throw { status: 400, message: 'nombre is required; capacidad_teu must be >= 0' }; });

            const res = await request(app)
                .post('/api/puertos')
                .send({})
                .set('Content-Type', 'application/json')
                .expect(400);

            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message).toContain('nombre');
            expect(res.body.data).toBeNull();
        });

        test('debe devolver 400 si falta un campo requerido (nombre)', async () => {
            const body = { ciudad: 'Valencia', pais: 'España', capacidad_teu: 1000, activo: true, fecha_inauguracion: '1970-01-01', profundidad_media: 10 };
            const res = await request(app).post('/api/puertos').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si capacidad_teu negativa', async () => {
            const body = { nombre: 'X', ciudad: 'Val', pais: 'ES', capacidad_teu: -1, activo: true, fecha_inauguracion: '1970-01-01', profundidad_media: 5 };
            const res = await request(app).post('/api/puertos').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si profundidad_media negativa', async () => {
            const body = { nombre: 'Xx', ciudad: 'Val', pais: 'ES', capacidad_teu: 100, activo: true, fecha_inauguracion: '1970-01-01', profundidad_media: -2 };
            const res = await request(app).post('/api/puertos').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si nombre demasiado corto', async () => {
            const body = { nombre: 'P', ciudad: 'Val', pais: 'ES', capacidad_teu: 100, activo: true, fecha_inauguracion: '1970-01-01', profundidad_media: 5 };
            const res = await request(app).post('/api/puertos').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si fecha_inauguracion inválida', async () => {
            const body = { nombre: 'Puerto', ciudad: 'Val', pais: 'ES', capacidad_teu: 100, activo: true, fecha_inauguracion: 'invalid-date', profundidad_media: 5 };
            const res = await request(app).post('/api/puertos').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });
    });

    describe('PUT /api/puertos/:id', () => {
        test('debe actualizar completamente un puerto y devolver número de filas afectadas', async () => {
            puertoService.updatePuerto.mockResolvedValue(1);

            const res = await request(app)
                .put('/api/puertos/1')
                .send({ nombre: 'Puerto Mod', ciudad: 'Valencia', pais: 'España', capacidad_teu: 5500000, activo: true, fecha_inauguracion: '1975-01-15', profundidad_media: 14.5 })
                .set('Content-Type', 'application/json')
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toBe(1);
        });

        test('debe devolver 400 si PUT tiene campos inválidos', async () => {
            const res = await request(app)
                .put('/api/puertos/1')
                .send({ nombre: 'P', ciudad: 'V', pais: 'E', capacidad_teu: -5, activo: 'si', fecha_inauguracion: 'x', profundidad_media: -1 })
                .set('Content-Type', 'application/json')
                .expect(400);

            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 404 si update no encuentra el puerto', async () => {
            puertoService.updatePuerto.mockImplementation(() => { throw { status: 404, message: 'Puerto not found' }; });
            const res = await request(app)
                .put('/api/puertos/999')
                .send({ nombre: 'Val', ciudad: 'Val', pais: 'ES', capacidad_teu: 1, activo: true, fecha_inauguracion: '1970-01-01', profundidad_media: 1 })
                .set('Content-Type', 'application/json')
                .expect(404);

            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Puerto not found');
        });
    });

    describe('PATCH /api/puertos/:id', () => {
        test('debe actualizar parcialmente y devolver número de filas afectadas', async () => {
            puertoService.updatePuerto.mockResolvedValue(1);

            const res = await request(app)
                .patch('/api/puertos/2')
                .send({ profundidad_media: 15.0 })
                .set('Content-Type', 'application/json')
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toBe(1);
        });

        test('debe devolver 400 si PATCH con body vacío', async () => {
            const res = await request(app)
                .patch('/api/puertos/2')
                .send({})
                .set('Content-Type', 'application/json')
                .expect(400);

            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 404 si PATCH no encuentra el puerto', async () => {
            puertoService.updatePuerto.mockImplementation(() => { throw { status: 404, message: 'Puerto not found' }; });
            const res = await request(app)
                .patch('/api/puertos/222')
                .send({ nombre: 'Nuevo' })
                .set('Content-Type', 'application/json')
                .expect(404);

            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Puerto not found');
        });
    });

    describe('DELETE /api/puertos/:id', () => {
        test('debe eliminar un puerto y devolver 204 sin contenido', async () => {
            puertoService.deletePuerto.mockResolvedValue(1);

            const res = await request(app).delete('/api/puertos/12').expect(204);

            // Respuesta 204 debe estar vacía (no JSON body)
            expect(res.text).toBe('');
        });

        test('debe devolver 400 para id inválido en DELETE', async () => {
            const res = await request(app).delete('/api/puertos/0').expect(400);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Invalid identifier');
        });

        test('debe devolver 404 si DELETE no encuentra el puerto', async () => {
            puertoService.deletePuerto.mockImplementation(() => { throw { status: 404, message: 'Puerto not found' }; });
            const res = await request(app).delete('/api/puertos/999').expect(404);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Puerto not found');
        });
    });

});
