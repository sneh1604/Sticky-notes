import React from "react";
import NoteCard from "../components/NoteCard";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import Controls from "../components/Controls";

const NotesPage = () => {
    const { notes } = useContext(NotesContext);
    return (
        <div>
            {notes.map((note) => (
                <NoteCard note={note} key={note.$id}  />
            ))}
            <Controls/>
        </div>
    );
};

export default NotesPage;

