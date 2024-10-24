import { useEffect,useRef , useState , useContext} from "react";
import Trash from "../icons/Trash";
import {setNewOffset , autoGrow , setZIndex , bodyParser} from '../utils.js'
import { db } from "../appwrite/databases.js";
import Spinner from "../icons/Spinner.jsx";
import DeleteButton from "./DeleteButton.jsx";
import { NotesContext } from "../context/NotesContext";



const NoteCard = ({ note }) => {
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);
    const [position, setPositon] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const textAreaRef = useRef(null);
    const body = bodyParser(note.body);


    useEffect(() => {
        setZIndex(cardRef.current);
        autoGrow(textAreaRef);
    }, []);


    let mouseStartPos = { x: 0, y: 0 };
 
    const cardRef = useRef(null);
    const { setSelectedNote } = useContext(NotesContext);

    const mouseDown = (e) => {
        if (e.target.className === "card-header") {

        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
     
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);

        setZIndex(cardRef.current);
        setSelectedNote(note);

        }

    };

    const mouseMove = (e) => {
        
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
     
        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

        setPositon(newPosition);
     
        //3 - Update card top and left position.
        setPositon({
            x: cardRef.current.offsetLeft - mouseMoveDir.x,
            y: cardRef.current.offsetTop - mouseMoveDir.y,
        });
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current); //{x,y}
        saveData("position", newPosition);
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const handleKeyUp = async () => {
        //1 - Initiate "saving" state
        setSaving(true);
     
        //2 - If we have a timer id, clear it so we can add another two seconds
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
     
        //3 - Set timer to trigger save in 2 seconds
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };
 
    return (
        <div
            ref={cardRef}
            className="card"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
             <div
        className="card-header"
        onMouseDown = { mouseDown }
        style={{ backgroundColor: colors.colorHeader }}
    > <DeleteButton noteId={note.$id} />
    {saving && (
        <div className="card-saving"> 
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
        </div>
    )}
</div>
               <div className="card-body">
                    <textarea
                        onKeyUp={handleKeyUp}
                        ref={textAreaRef}
                        onFocus={() => {
                            setZIndex(cardRef.current);
                        }}
                        style={{ color: colors.colorText }}
                        defaultValue={body}
                        onInput={() => {
                            autoGrow(textAreaRef);
                       }}
                    ></textarea>
                </div>
        
          </div>
        );
};

export default NoteCard;