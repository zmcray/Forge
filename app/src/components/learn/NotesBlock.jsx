export default function NotesBlock({ noteId, getNoteText, setNoteText }) {
  const text = getNoteText(noteId);

  return (
    <div className="my-4 border border-outline-variant/30 rounded-lg overflow-hidden">
      <div className="bg-surface-container-low px-4 py-2 border-b border-outline-variant/30">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">My Notes</span>
      </div>
      <div className="p-3">
        <textarea
          value={text}
          onChange={(e) => setNoteText(noteId, e.target.value)}
          placeholder="Write your own summary, key takeaways, or questions here. Notes are saved automatically."
          className="w-full min-h-[100px] text-sm text-on-surface bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3 resize-y focus:outline-none focus:border-primary/50 placeholder:text-outline-variant"
        />
      </div>
    </div>
  );
}
