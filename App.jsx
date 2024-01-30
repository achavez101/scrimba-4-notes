import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import {onSnapshot, addDoc, doc, deleteDoc, setDoc} from "firebase/firestore"
import {notesCollection, db} from "./firebase"

export default function App() {
    // notes setting in the useState
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")
        
    const currentNote = 
        notes.find(note => note.id === currentNoteId)
        || notes[0]
    // sorted notes
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    // save to database through Snapshot
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
              // sync local notes array with snapshot data
              const notesArr = snapshot.docs.map(doc => ({
                  ...doc.data(),
                  id: doc.id
              }))
              setNotes(notesArr)
        })
        return unsubscribe
    }, [])
    
    // use Effect for current Note
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])
    
    // use Effect for current note
    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])
    
    // use effect that will run anytime anything in notes changes
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])
    
    // creating a new Note
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(
            docRef, 
            { body: text, updatedAt: Date.now() }, 
            { merge: true }
        )
    }
       // local storage below!
        // Try to rearrange the most recently-modified
        // not to be at the top
        // setNotes(oldNotes => {
        //     const newArray = []
        //     for(let i = 0; i < oldNotes.length; i++) {
        //         const oldNote = oldNotes[i]
        //         if(oldNote.id === currentNoteId) {
        //             newArray.unshift({ ...oldNote, body: text })
        //         } else {
        //             newArray.push(oldNote)
        //         }
        //     }
        //     return newArray
        // })
     
     
     async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }
    
    // function findCurrentNote() {
    //     return notes.find(note => {
    //         return note.id === currentNoteId
    //     }) || notes[0]
    // }
    
    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
