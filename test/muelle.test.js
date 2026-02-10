const request = require('supertest');

// Mock del servicio antes de cargar la app
jest.mock('../services/muelleService', () => ({
    getMuelles: jest.fn(),
    getMuelleById: jest.fn(),
    createMuelle: jest.fn(),
    updateMuelle: jest.fn(),
    deleteMuelle: jest.fn()
}));

const muelleService = require('../services/muelleService');
const app = require('../app');

describe('API Muelles', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/muelles', () => {
        test('debe devolver lista de muelles con estructura {rows, count}', async () => {
            const sampleRows = [
                { id_muelle: 1, id_puerto: 1, nombre: 'Muelle A', longitud_m: 500.5, calado_m: 12.5, operativo: true, fecha_construccion: '1970-01-01', tipo: 'granel' },
                { id_muelle: 2, id_puerto: 1, nombre: 'Muelle B', longitud_m: 300.0, calado_m: 10.0, operativo: false, fecha_construccion: '1980-02-02', tipo: 'carga' }
            ];
            muelleService.getMuelles.mockResolvedValue({ rows: sampleRows, count: sampleRows.length });

            const res = await request(app).get('/api/muelles').expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toHaveProperty('rows');
            expect(res.body.data).toHaveProperty('count', 2);
            expect(Array.isArray(res.body.data.rows)).toBe(true);
            expect(res.body.data.rows[0]).toMatchObject({ nombre: 'Muelle A', longitud_m: 500.5 });
        });

        test('debe devolver 400 para parámetros de query inválidos (limit=0)', async () => {
            const res = await request(app).get('/api/muelles?limit=0').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
            expect(res.body.data).toBeNull();
        });

        test('debe devolver 400 para offset negativo', async () => {
            const res = await request(app).get('/api/muelles?offset=-1').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });

        test('debe devolver 400 para order con campo no permitido', async () => {
            const res = await request(app).get('/api/muelles?order=noexiste:asc').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });

        test('debe devolver 400 para filtros con tipo incorrecto (longitud_m no decimal)', async () => {
            const res = await request(app).get('/api/muelles?longitud_m=abc').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });

        test('debe devolver 400 si rango _min > _max', async () => {
            const res = await request(app).get('/api/muelles?longitud_m_min=100&longitud_m_max=10').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });

        test('debe devolver 400 para parámetro desconocido en query', async () => {
            const res = await request(app).get('/api/muelles?foo=bar').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/muelles/:id', () => {
        test('debe devolver un muelle por id con los campos esperados', async () => {
            const muelle = { id_muelle: 5, id_puerto: 2, nombre: 'Muelle X', longitud_m: 600.75, calado_m: 11.5, operativo: true, fecha_construccion: '1965-03-20', tipo: 'pasajeros' };
            muelleService.getMuelleById.mockResolvedValue(muelle);

            const res = await request(app).get('/api/muelles/5').expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toMatchObject({ id_muelle: 5, nombre: 'Muelle X', longitud_m: 600.75 });
        });

        test('debe devolver 400 para id inválido 0', async () => {
            const res = await request(app).get('/api/muelles/0').expect(400);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Invalid identifier');
        });

        test('debe devolver 400 para id float como string (1.0)', async () => {
            const res = await request(app).get('/api/muelles/1.0').expect(400);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Invalid identifier');
        });

        test('debe devolver 400 para id no numérico', async () => {
            const res = await request(app).get('/api/muelles/abc').expect(400);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Invalid identifier');
        });

        test('debe devolver 404 si el servicio no encuentra el muelle', async () => {
            muelleService.getMuelleById.mockImplementation(() => { throw { status: 404, message: 'Muelle not found' }; });
            const res = await request(app).get('/api/muelles/9999').expect(404);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Muelle not found');
        });
    });

    describe('POST /api/muelles', () => {
        test('debe crear un muelle y devolver 201 con el objeto creado', async () => {
            const newMuelle = { id_puerto: 1, nombre: 'Muelle Nuevo', longitud_m: 450.5, calado_m: 13.0, operativo: true, fecha_construccion: '2007-01-15', tipo: 'granel' };
            const created = { id_muelle: 10, ...newMuelle };
            muelleService.createMuelle.mockResolvedValue(created);

            const res = await request(app)
                .post('/api/muelles')
                .send(newMuelle)
                .set('Content-Type', 'application/json')
                .expect(201);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toMatchObject({ id_muelle: 10, nombre: 'Muelle Nuevo' });
        });

        test('debe propagar error 400 cuando el servicio lanza un ApiError de validación', async () => {
            muelleService.createMuelle.mockImplementation(() => { throw { status: 400, message: 'nombre is required; longitud_m must be >= 0' }; });

            const res = await request(app)
                .post('/api/muelles')
                .send({})
                .set('Content-Type', 'application/json')
                .expect(400);

            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message).toContain('nombre');
            expect(res.body.data).toBeNull();
        });

        test('debe devolver 400 si falta un campo requerido (nombre)', async () => {
            const body = { id_puerto: 1, longitud_m: 500, calado_m: 10, operativo: true, fecha_construccion: '1970-01-01', tipo: 'carga' };
            const res = await request(app).post('/api/muelles').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si longitud_m negativa', async () => {
            const body = { id_puerto: 1, nombre: 'X', longitud_m: -1, calado_m: 5, operativo: true, fecha_construccion: '1970-01-01', tipo: 'pasajeros' };
            const res = await request(app).post('/api/muelles').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si calado_m negativo', async () => {
            const body = { id_puerto: 1, nombre: 'Xx', longitud_m: 100, calado_m: -2, operativo: true, fecha_construccion: '1970-01-01', tipo: 'granel' };
            const res = await request(app).post('/api/muelles').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si nombre demasiado corto', async () => {
            const body = { id_puerto: 1, nombre: 'M', longitud_m: 100, calado_m: 10, operativo: true, fecha_construccion: '1970-01-01', tipo: 'granel' };
            const res = await request(app).post('/api/muelles').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si fecha_construccion inválida', async () => {
            const body = { id_puerto: 1, nombre: 'Muelle', longitud_m: 100, calado_m: 10, operativo: true, fecha_construccion: 'invalid-date', tipo: 'carga' };
            const res = await request(app).post('/api/muelles').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 400 si tipo inválido', async () => {
            const body = { id_puerto: 1, nombre: 'Muelle', longitud_m: 100, calado_m: 10, operativo: true, fecha_construccion: '1970-01-01', tipo: 'Ínvalido' };
            const res = await request(app).post('/api/muelles').send(body).set('Content-Type', 'application/json').expect(400);
            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });
    });

    describe('PUT /api/muelles/:id', () => {
        test('debe actualizar completamente un muelle y devolver número de filas afectadas', async () => {
            muelleService.updateMuelle.mockResolvedValue(1);

            const res = await request(app)
                .put('/api/muelles/1')
                .send({ id_puerto: 1, nombre: 'Muelle Mod', longitud_m: 700.5, calado_m: 14.5, operativo: true, fecha_construccion: '1975-01-15', tipo: 'granel' })
                .set('Content-Type', 'application/json')
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toBe(1);
        });

        test('debe devolver 400 si PUT tiene campos inválidos', async () => {
            const res = await request(app)
                .put('/api/muelles/1')
                .send({ id_puerto: 1, nombre: 'M', longitud_m: -5, calado_m: -1, operativo: 'si', fecha_construccion: 'x', tipo: 'Invalido' })
                .set('Content-Type', 'application/json')
                .expect(400);

            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 404 si update no encuentra el muelle', async () => {
            muelleService.updateMuelle.mockImplementation(() => { throw { status: 404, message: 'Muelle not found' }; });
            const res = await request(app)
                .put('/api/muelles/999')
                .send({ id_puerto: 1, nombre: 'Muelle', longitud_m: 500, calado_m: 10, operativo: true, fecha_construccion: '1970-01-01', tipo: 'carga' })
                .set('Content-Type', 'application/json')
                .expect(404);

            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Muelle not found');
        });
    });

    describe('PATCH /api/muelles/:id', () => {
        test('debe actualizar parcialmente y devolver número de filas afectadas', async () => {
            muelleService.updateMuelle.mockResolvedValue(1);

            const res = await request(app)
                .patch('/api/muelles/2')
                .send({ calado_m: 15.0 })
                .set('Content-Type', 'application/json')
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.data).toBe(1);
        });

        test('debe devolver 400 si PATCH con body vacío', async () => {
            const res = await request(app)
                .patch('/api/muelles/2')
                .send({})
                .set('Content-Type', 'application/json')
                .expect(400);

            expect(res.body.ok).toBe(false);
            expect(typeof res.body.message).toBe('string');
        });

        test('debe devolver 404 si PATCH no encuentra el muelle', async () => {
            muelleService.updateMuelle.mockImplementation(() => { throw { status: 404, message: 'Muelle not found' }; });
            const res = await request(app)
                .patch('/api/muelles/222')
                .send({ nombre: 'Nuevo' })
                .set('Content-Type', 'application/json')
                .expect(404);

            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Muelle not found');
        });
    });

    describe('DELETE /api/muelles/:id', () => {
        test('debe eliminar un muelle y devolver 204 sin contenido', async () => {
            muelleService.deleteMuelle.mockResolvedValue(1);

            const res = await request(app).delete('/api/muelles/12').expect(204);

            // Respuesta 204 debe estar vacía (no JSON body)
            expect(res.text).toBe('');
        });

        test('debe devolver 400 para id inválido en DELETE', async () => {
            const res = await request(app).delete('/api/muelles/0').expect(400);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Invalid identifier');
        });

        test('debe devolver 404 si DELETE no encuentra el muelle', async () => {
            muelleService.deleteMuelle.mockImplementation(() => { throw { status: 404, message: 'Muelle not found' }; });
            const res = await request(app).delete('/api/muelles/999').expect(404);
            expect(res.body.ok).toBe(false);
            expect(res.body.message).toBe('Muelle not found');
        });
    });

});
