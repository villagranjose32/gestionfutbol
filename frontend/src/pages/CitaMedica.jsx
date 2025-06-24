import React, { useState } from 'react';
import Layout from "../components/Layout";

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJugadores, setFilteredJugadores] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const jugadores = [
    { value: 'jugador0', label: 'Seleccione una opción', nombre: '', apellido: '', dni: '' },
    { value: 'jugador1', label: 'Juan Pérez', nombre: 'Juan', apellido: 'Pérez', dni: '12345678' },
    { value: 'jugador2', label: 'Carlos Gómez', nombre: 'Carlos', apellido: 'Gómez', dni: '87654321' },
    { value: 'jugador3', label: 'Ana López', nombre: 'Ana', apellido: 'López', dni: '11223344' },
    { value: 'jugador4', label: 'Luis Fernández', nombre: 'Luis', apellido: 'Fernández', dni: '44332211' }
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

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filtered = jugadores.filter(player =>
        (player.nombre && player.nombre.toLowerCase().includes(term.toLowerCase())) ||
        (player.apellido && player.apellido.toLowerCase().includes(term.toLowerCase())) ||
        (player.dni && player.dni.includes(term))
      );
      setFilteredJugadores(filtered.filter(player => player.value !== 'jugador0'));
      setShowSuggestions(true);
    } else {
      setFilteredJugadores([]);
      setShowSuggestions(false);
    }

    if (term === '') {
      setForm(prevForm => ({ ...prevForm, jugador: '' }));
    }
  };

  const handleSelectPlayer = (player) => {
    setForm({ ...form, jugador: player.value });
    setSearchTerm(player.label);
    setShowSuggestions(false);
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
    setSearchTerm('');
    setFilteredJugadores([]);
    setShowSuggestions(false);
  };

  // Cambia el color de fondo del formulario según el tipo de informe
  let formBg = '#fff';
  if (form.tipoInforme === 'medico') formBg = '#E0F2F7';        // Celeste
  if (form.tipoInforme === 'social') formBg = '#FFC0CB';        // Gris claro
  if (form.tipoInforme === 'datos_fisicos') formBg = '#C8E6C9'; // Verde claro

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    marginTop: '8px',
    border: '1px solid #c8d8e8',
    borderRadius: '10px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.03)',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  };

  const buttonBaseStyle = {
    padding: '12px 28px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    background: '#34495e',
    color: '#fff',
  };

  const suggestionsContainerStyle = {
    position: 'absolute',
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    backgroundColor: '#fff',
    zIndex: 100,
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    marginTop: '5px',
  };

  const suggestionItemStyle = {
    padding: '10px 15px',
    cursor: 'pointer',
  };

  return (
    <Layout>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: '#EAEAEA',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '4rem 1.5rem'
      }}>
        <div style={{
          maxWidth: 800,
          width: '100%',
          margin: '0 auto',
          background: formBg,
          borderRadius: '20px',
          padding: '3rem 3.5rem',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid #c8d8e8',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#1A2B3C',
            fontSize: '2rem',
            fontWeight: '800',
            letterSpacing: '-0.5px',
          }}>REGISTRO DE INFORME</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>BUSCAR JUGADOR</label>
              <input
                type="text"
                name="jugadorSearch"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                placeholder="Buscar por nombre, apellido o DNI"
                style={inputStyle}
                required
              />
              {showSuggestions && filteredJugadores.length > 0 && (
                <div style={suggestionsContainerStyle}>
                  {filteredJugadores.map(player => (
                    <div
                      key={player.value}
                      style={suggestionItemStyle}
                      onClick={() => handleSelectPlayer(player)}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      {player.label} - DNI: {player.dni}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>TIPO DE INFORME</label>
              <select
                name="tipoInforme"
                value={form.tipoInforme}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                {tiposInforme.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Campos adicionales para Datos Físicos */}
            {form.tipoInforme === 'datos_fisicos' && (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>FECHA DE REGISTRO</label>
                  <input
                    type="datetime-local"
                    name="fecha_registro"
                    value={form.fecha_registro}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 'calc(50% - 0.75rem)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>ALTURA (m)</label>
                    <input
                      type="number"
                      name="altura"
                      value={form.altura}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="Ej: 1.75"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 'calc(50% - 0.75rem)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>PESO (kg)</label>
                    <input
                      type="number"
                      name="peso"
                      value={form.peso}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="Ej: 70.5"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campos adicionales para Informe Médico */}
            {form.tipoInforme === 'medico' && (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>DIAGNÓSTICO</label>
                  <input
                    type="text"
                    name="diagnostico"
                    value={form.diagnostico}
                    onChange={handleChange}
                    maxLength={50}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 'calc(50% - 0.75rem)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>FECHA INICIO</label>
                    <input
                      type="date"
                      name="fecha_inicio"
                      value={form.fecha_inicio}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 'calc(50% - 0.75rem)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>FECHA FIN</label>
                    <input
                      type="date"
                      name="fecha_fin"
                      value={form.fecha_fin}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>DOCUMENTO (png, jpg, pdf)</label>
                  <input
                    type="file"
                    name="documento"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleChange}
                    style={{ ...inputStyle, border: 'none', paddingLeft: '0', backgroundColor: 'transparent', boxShadow: 'none' }}
                    required
                  />
                </div>
              </>
            )}

            {/* Campos adicionales para Informe Social */}
            {form.tipoInforme === 'social' && (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>GRUPO FAMILIAR</label>
                  <input
                    type="text"
                    name="grupo_familiar"
                    value={form.grupo_familiar}
                    onChange={handleChange}
                    placeholder="Ej: Madre, padre, 2 hermanos"
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 'calc(50% - 0.75rem)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>OCUPACIÓN PADRE</label>
                    <input
                      type="text"
                      name="ocupacion_padre"
                      value={form.ocupacion_padre}
                      onChange={handleChange}
                      placeholder="Ej: Trabajador independiente"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 'calc(50% - 0.75rem)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>OCUPACIÓN MADRE</label>
                    <input
                      type="text"
                      name="ocupacion_madre"
                      value={form.ocupacion_madre}
                      onChange={handleChange}
                      placeholder="Ej: Ama de casa"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>VIVIENDA</label>
                  <input
                    type="text"
                    name="vivienda"
                    value={form.vivienda}
                    onChange={handleChange}
                    placeholder="Ej: Casa propia, alquiler, etc."
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>ESCOLARIDAD</label>
                  <input
                    type="text"
                    name="escolaridad"
                    value={form.escolaridad}
                    onChange={handleChange}
                    placeholder="Ej: Secundario completo"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>OCUPACIÓN</label>
                  <input
                    type="text"
                    name="ocupacion"
                    value={form.ocupacion}
                    onChange={handleChange}
                    placeholder="Ej: Estudiante, empleado"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>COBERTURA MÉDICA</label>
                  <input
                    type="text"
                    name="cobertura_medica"
                    value={form.cobertura_medica}
                    onChange={handleChange}
                    placeholder="Ej: Obra social, prepaga, etc."
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>CLUB ANTERIOR</label>
                  <input
                    type="text"
                    name="club_anterior"
                    value={form.club_anterior}
                    onChange={handleChange}
                    placeholder="Ej: Club Atlético Ejemplo"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>ARCHIVO</label>
                  <input
                    type="file"
                    name="archivo_social"
                    onChange={handleChange}
                    style={{ ...inputStyle, border: 'none', paddingLeft: '0', backgroundColor: 'transparent', boxShadow: 'none' }}
                    required
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.95rem' }}>OBSERVACIONES</label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                required
                placeholder="Agrega información adicional aquí..."
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="submit"
                style={primaryButtonStyle}
              >
                GUARDAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CitaMedica;