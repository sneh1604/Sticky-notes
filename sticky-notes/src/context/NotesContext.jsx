import { createContext, useState, useEffect } from "react";
import Spinner from "../icons/Spinner";
import { db } from "../appwrite/databases";

export const NotesContext = createContext();

const NotesProvider = ({ children }) => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                const response = await db.notes.list();
                setNotes(response.documents);
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const contextData = {
        notes,
        setNotes,
        selectedNote,
        setSelectedNote
    };

    return (
        <NotesContext.Provider value={contextData}>
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <Spinner size="100" />
                </div>
            ) : (
                children
            )}
        </NotesContext.Provider>
    );
};

export default NotesProvider;
