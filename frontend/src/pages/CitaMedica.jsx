import React, { useState } from 'react';

const CitaMedica = () => {
  const [form, setForm] = useState({
    jugador: '',
    tipoInforme: '',
    fecha: '',
    observaciones: '',
    // Datos Físicos
    fecha_registro: '',
    altura: '',
    peso: '',
    // Médico
    diagnostico: '',
    fecha_inicio: '',
    fecha_fin: '',
    documento: null,
    // Social
    situacion_social: '',
    gestionado_por: '',
    archivo_social: null,
    grupo_familiar: '',
    vivienda: '',
    escolaridad: '',
    ocupacion: '',
    cobertura_medica: '',
    club_anterior: ''
  });


  const jugadores = [
    { value: '', label: 'Seleccione una opción' },
    { value: 'jugador1', label: 'Juan Pérez' },
    { value: 'jugador2', label: 'Carlos Gómez' }
  ];

  const tiposInforme = [
    { value: '', label: 'Seleccione una opción' },
    { value: 'medico', label: 'Médico' },
    { value: 'social', label: 'Social' },
    { value: 'datos_fisicos', label: 'Datos Físicos' }
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (form.tipoInforme === 'medico' && form.documento) ||
      (form.tipoInforme === 'social' && form.archivo_social)
    ) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      console.log('Datos enviados (FormData):', formData);
    } else {
      console.log('Datos enviados:', form);
    }
  };

  const handleCancel = () => {
    setForm({
      jugador: '',
      tipoInforme: '',
      fecha: '',
      observaciones: '',
      fecha_registro: '',
      altura: '',
      peso: '',
      diagnostico: '',
      fecha_inicio: '',
      fecha_fin: '',
      documento: null,
      situacion_social: '',
      gestionado_por: '',
      archivo_social: null,
      grupo_familiar: '',
      ocupacion_padre: '',
      ocupacion_madre: '',
      vivienda: '',
      escolaridad: '',
      ocupacion: '',
      cobertura_medica: '',
      club_anterior: ''
    });
  };

  return (
    <div style={{ background: '#f7f9fb', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 12, padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>INFORME MÉDICO / PSICOLÓGICO</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={{ marginBottom: '1.5rem' }}>
            <label><b>JUGADOR</b></label>
            <select
              name="jugador"
              value={form.jugador}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              required
            >
              {jugadores.map(j => (
                <option key={j.value} value={j.value}>{j.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label><b>TIPO DE INFORME</b></label>
              <select
                name="tipoInforme"
                value={form.tipoInforme}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
                required
              >
                {tiposInforme.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label><b>FECHA</b></label>
              <input
                type="datetime-local"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
                required
              />
            </div>
          </div>

          {/* Campos adicionales para Datos Físicos */}
          {form.tipoInforme === 'datos_fisicos' && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label><b>FECHA DE REGISTRO</b></label>
                <input
                  type="datetime-local"
                  name="fecha_registro"
                  value={form.fecha_registro}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label><b>ALTURA (m)</b></label>
                <input
                  type="number"
                  name="altura"
                  value={form.altura}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Ej: 1.75"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label><b>PESO (kg)</b></label>
                <input
                  type="number"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Ej: 70.5"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  required
                />
              </div>
            </div>
          )}

          {/* Campos adicionales para Informe Médico */}
          {form.tipoInforme === 'medico' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>DIAGNÓSTICO</b></label>
                <input
                  type="text"
                  name="diagnostico"
                  value={form.diagnostico}
                  onChange={handleChange}
                  maxLength={50}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label><b>FECHA INICIO</b></label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={form.fecha_inicio}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label><b>FECHA FIN</b></label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={form.fecha_fin}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                    required
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>DOCUMENTO (png, jpg, pdf)</b></label>
                <input
                  type="file"
                  name="documento"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleChange}
                  style={{ width: '100%', marginTop: 4 }}
                  required
                />
              </div>
            </>
          )}

          {/* Campos adicionales para Informe Social */}
          {form.tipoInforme === 'social' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>SITUACIÓN SOCIAL</b></label>
                <input
                  type="text"
                  name="situacion_social"
                  value={form.situacion_social}
                  onChange={handleChange}
                  placeholder="Ej: Contexto Social en el que se encuentra el jugador"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>GESTIONADO POR</b></label>
                <input
                  type="text"
                  name="gestionado_por"
                  value={form.gestionado_por}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  required
                />
              </div>
              {/* Ficha social estilo censo */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>GRUPO FAMILIAR</b></label>
                <input
                  type="text"
                  name="grupo_familiar"
                  value={form.grupo_familiar}
                  onChange={handleChange}
                  placeholder="Ej: Madre, padre, 2 hermanos"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>OCUPACIÓN PADRE</b></label>
                <input
                  type="text"
                  name="ocupacion_padre"
                  value={form.ocupacion_padre}
                  onChange={handleChange}
                  placeholder="Ej: Trabajador independiente"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>OCUPACIÓN MADRE</b></label>
                <input
                  type="text"
                  name="ocupacion_madre"
                  value={form.ocupacion_madre}
                  onChange={handleChange}
                  placeholder="Ej: Ama de casa"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>VIVIENDA</b></label>
                <input
                  type="text"
                  name="vivienda"
                  value={form.vivienda}
                  onChange={handleChange}
                  placeholder="Ej: Casa propia, alquiler, etc."
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>ESCOLARIDAD</b></label>
                <input
                  type="text"
                  name="escolaridad"
                  value={form.escolaridad}
                  onChange={handleChange}
                  placeholder="Ej: Secundario completo"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>OCUPACIÓN</b></label>
                <input
                  type="text"
                  name="ocupacion"
                  value={form.ocupacion}
                  onChange={handleChange}
                  placeholder="Ej: Estudiante, empleado"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>COBERTURA MÉDICA</b></label>
                <input
                  type="text"
                  name="cobertura_medica"
                  value={form.cobertura_medica}
                  onChange={handleChange}
                  placeholder="Ej: Obra social, prepaga, etc."
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>CLUB ANTERIOR</b></label>
                <input
                  type="text"
                  name="club_anterior"
                  value={form.club_anterior}
                  onChange={handleChange}
                  placeholder="Ej: Club Atlético Ejemplo"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label><b>ARCHIVO</b></label>
                <input
                  type="file"
                  name="archivo_social"
                  onChange={handleChange}
                  style={{ width: '100%', marginTop: 4 }}
                  required
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <label><b>OBSERVACIONES</b></label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={5}
              style={{ width: '100%', padding: 8, marginTop: 4, resize: 'vertical' }}
              required
              placeholder="agrega informacion adicional"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="submit"
              style={{
                background: '#22395d',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              GUARDAR
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                background: '#22395d',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              CANCELAR
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              style={{
                background: '#f0ad4e',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              EDITAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitaMedica;