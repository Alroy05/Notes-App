import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, NotebookPen } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';
import NoteCard from '../../components/notes/NoteCard';

export default function NotesList() {
  const { 
    notes, 
    isLoading, 
    error, 
    fetchNotes, 
    searchQuery, 
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    getFilteredNotes 
  } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Get all unique tags from notes
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  if (isLoading) return <div className="text-center py-8">Loading notes...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  const filteredNotes = getFilteredNotes();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-bold flex items-center">
          <NotebookPen className="mr-2" /> My Notes
        </h1>
        <Link
          to="/notes/new"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-1" /> New Note
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm ${!selectedTag ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || selectedTag 
              ? 'No notes match your search' 
              : 'You have no notes yet. Create your first note!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes
            .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
            .map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
        </div>
      )}
    </div>
  );
}