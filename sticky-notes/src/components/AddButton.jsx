import Plus from "../icons/Plus";
import colors from "../assets/colors.json";
import { useContext, useRef } from "react";
import { db } from "../appwrite/databases";
import { NotesContext } from "../context/NotesContext";

const AddButton = () => {
    const startingPos = useRef(10);
    const { setNotes } = useContext(NotesContext);

    const addNote = async () => {
        const payload = {
            position: JSON.stringify({
                x: startingPos.current,
                y: startingPos.current,
            }),
            colors: JSON.stringify(colors[0]), // Ensure `colors[0]` is properly structured
        };

        startingPos.current += 10;

        try {
            const response = await db.notes.create(payload);
            setNotes((prevState) => [response, ...prevState]);
        } catch (error) {
            console.error("Failed to create a new note:", error);
        }
    };

    return (
        <div
            id="add-btn"
            onClick={addNote}
            style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
            }}
        >
            <Plus />
        </div>
    );
};

export default AddButton;
