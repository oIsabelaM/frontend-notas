import { useState, useEffect } from 'react';
import axios from 'axios';

// URL base da API (na Etapa 9 você substituirá esta URL pela do Render)
const API_URL = 'http://localhost:3000/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  // 1. READ - Buscar notas
  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 2. CREATE / UPDATE - Salvar ou atualizar nota
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('Preencha todos os campos!');

    try {
      if (editingId) {
        // Atualizar nota existente (PUT)
        await axios.put(`${API_URL}/${editingId}`, { title, content });
        setEditingId(null);
      } else {
        // Criar nova nota (POST)
        await axios.post(API_URL, { title, content });
      }

      setTitle('');
      setContent('');
      fetchNotes(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
    }
  };

  // Prepara os campos para edição
  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  // Cancela o modo de edição
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  // 3. DELETE - Excluir nota
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchNotes();
      } catch (error) {
        console.error('Erro ao excluir nota:', error);
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gerenciador de Notas</h1>

      {/* Formulario de Cadastro / Edição */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>{editingId ? 'Editar Nota' : 'Nova Nota'}</h2>
        <input
          type="text"
          placeholder="Título da nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <textarea
          placeholder="Conteúdo da nota"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
            {editingId ? 'Atualizar Nota' : 'Adicionar Nota'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Listagem das Notas */}
      <h2>Suas Notas</h2>
      {notes.length === 0 ? (
        <p>Nenhuma nota cadastrada.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {notes.map((note) => (
            <div key={note.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => handleEdit(note)}>Editar</button>
                <button onClick={() => handleDelete(note.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;