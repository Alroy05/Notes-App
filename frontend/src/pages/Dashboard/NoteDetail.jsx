import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNotesStore } from '../../store/notesStore';
import { Edit, ArrowLeft, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '../../components/notes/DeleteConfirmationModal';

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, getNote, deleteNote, isLoading, error } = useNotesStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getNote(id);
    }
  }, [id, getNote]);

  const handleDelete = async () => {
    try {
      await deleteNote(id);
      toast.success('Note deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading note...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!currentNote) return <div className="text-center py-8">Note not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="mr-1" /> Back to notes
        </button>
        <div className="flex space-x-3">
          <Link
            to={`/notes/${id}/edit`}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Edit size={16} className="mr-1" /> Edit
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </button>
        </div>
      </div>

      <div 
        className={`p-6 rounded-lg ${currentNote.color !== '#ffffff' ? 'text-black' : 'text-gray-800 dark:text-gray-600'}`}
        style={{ backgroundColor: currentNote.color }}
      >
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{currentNote.title}</h1>
          {currentNote.isPinned && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Pinned
            </span>
          )}
        </div>

        {currentNote.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentNote.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          {currentNote.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName="note"
      />
    </div>
  );
}