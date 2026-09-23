import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// URL da API publicada no Render
const API_URL = 'https://projeto-notas-4em4.onrender.com/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // 1. READ - Buscar notas
  const fetchNotes = async () => {
    setErro('');
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      setErro('Não foi possível carregar as notas. O servidor pode estar iniciando, tente novamente em instantes.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 2. CREATE / UPDATE - Salvar ou atualizar nota
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !texto.trim()) {
      setErro('Preencha o título e o texto da nota.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { titulo, texto });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { titulo, texto });
      }

      setTitulo('');
      setTexto('');
      setErro('');
      fetchNotes();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      setErro('Não foi possível salvar a nota. Tente novamente.');
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitulo(note.titulo);
    setTexto(note.texto);
    setErro('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitulo('');
    setTexto('');
    setErro('');
  };

  // 3. DELETE - Excluir nota
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta nota?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      setErro('Não foi possível excluir a nota. Tente novamente.');
    }
  };

  return (
    <main className="app">
      <header className="topo">
        <div className="titulo-marca">
          <span className="marca-icone" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="30" height="30">
              <path d="M16 10h26l10 10v34a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z" />
              <path d="M42 10v10h10" />
              <path d="M22 30h20M22 38h20M22 46h12" />
            </svg>
          </span>
          <h1>Minhas Notas</h1>
        </div>
        <p className="subtitulo">Suas anotações, sempre à mão.</p>
      </header>

      <section className="cartao formulario">
        <h2>{editingId ? 'Editar nota' : 'Nova nota'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              placeholder="Ex.: Lembretes"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="texto">Texto</label>
            <textarea
              id="texto"
              placeholder="Escreva sua anotação..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows="4"
            />
          </div>

          {erro && <p className="erro" role="alert">{erro}</p>}

          <div className="acoes-form">
            <button type="submit" className="btn">
              {editingId ? 'Atualizar nota' : 'Adicionar nota'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-contorno" onClick={handleCancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="lista-secao">
        <div className="lista-cabecalho">
          <h2>Suas notas</h2>
          {!carregando && <span className="contagem">{notes.length}</span>}
        </div>

        {carregando ? (
          <p className="aviso">Carregando notas...</p>
        ) : notes.length === 0 ? (
          <div className="vazio">
            <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
              <path d="M16 10h26l10 10v34a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z" />
              <path d="M42 10v10h10" />
              <path d="M24 40q3 4 8 4t8-4" />
              <circle cx="26" cy="30" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="38" cy="30" r="1.6" fill="currentColor" stroke="none" />
            </svg>
            <p>Nenhuma nota cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grade">
            {notes.map((note) => (
              <article key={note.id} className={`nota ${editingId === note.id ? 'em-edicao' : ''}`}>
                <h3>{note.titulo}</h3>
                <p>{note.texto}</p>
                <div className="nota-rodape">
                  <button className="btn-link" onClick={() => handleEdit(note)}>Editar</button>
                  <button className="btn-link btn-excluir" onClick={() => handleDelete(note.id)}>Excluir</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="rodape">
        <p>Feito com React por Isabela. API em Express, publicada no Render.</p>
      </footer>
    </main>
  );
}

export default App;
