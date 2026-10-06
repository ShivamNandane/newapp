// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Modal,
// } from 'react-native';

// import {
//   getFirestore,
//   collection,
//   addDoc,
//   onSnapshot,
//   deleteDoc,
//   updateDoc,
//   doc,
//   serverTimestamp,
// } from '@react-native-firebase/firestore';

// import {
//   useAuth,
// } from '../context/AuthContext';


// function NotesScreen() {

//   const {user} = useAuth();

//   const firestore = getFirestore();


//   // =====================================================
//   // NOTES
//   // =====================================================

//   const [notes, setNotes] = useState([]);

//   const [loading, setLoading] = useState(true);


//   // =====================================================
//   // ADD NOTE
//   // =====================================================

//   const [title, setTitle] = useState('');

//   const [description, setDescription] =
//     useState('');

//   const [saving, setSaving] =
//     useState(false);


//   // =====================================================
//   // EDIT NOTE
//   // =====================================================

//   const [editModalVisible, setEditModalVisible] =
//     useState(false);

//   const [editingNote, setEditingNote] =
//     useState(null);

//   const [editTitle, setEditTitle] =
//     useState('');

//   const [editDescription, setEditDescription] =
//     useState('');

//   const [updating, setUpdating] =
//     useState(false);


//   // =====================================================
//   // SEARCH
//   // =====================================================

//   const [search, setSearch] =
//     useState('');


//   // =====================================================
//   // SORT
//   // =====================================================

//   const [sortOrder, setSortOrder] =
//     useState('newest');


//   // =====================================================
//   // FIRESTORE LISTENER
//   // =====================================================

//   useEffect(() => {

//     if (!user?.uid) {

//       setNotes([]);

//       setLoading(false);

//       return;
//     }


//     console.log(
//       'Loading notes for user:',
//       user.uid,
//     );


//     const notesRef = collection(
//       firestore,
//       'users',
//       user.uid,
//       'notes',
//     );


//     const unsubscribe = onSnapshot(
//       notesRef,

//       snapshot => {

//         const notesData =
//           snapshot.docs.map(noteDoc => ({

//             id: noteDoc.id,

//             ...noteDoc.data(),

//           }));


//         console.log(
//           'NOTES LOADED:',
//           notesData.length,
//         );


//         setNotes(notesData);

//         setLoading(false);
//       },

//       error => {

//         console.log(
//           'LOAD NOTES ERROR:',
//           error,
//         );

//         setLoading(false);

//         Alert.alert(
//           'Error',
//           'Unable to load notes.',
//         );
//       },
//     );


//     return unsubscribe;

//   }, [user?.uid]);


//   // =====================================================
//   // ADD NOTE
//   // =====================================================

//   const handleAddNote = async () => {

//     const cleanTitle =
//       title.trim();

//     const cleanDescription =
//       description.trim();


//     if (!cleanTitle) {

//       Alert.alert(
//         'Error',
//         'Please enter a note title.',
//       );

//       return;
//     }


//     if (!user?.uid) {

//       Alert.alert(
//         'Error',
//         'User is not authenticated.',
//       );

//       return;
//     }


//     try {

//       setSaving(true);


//       const notesRef = collection(
//         firestore,
//         'users',
//         user.uid,
//         'notes',
//       );


//       await addDoc(
//         notesRef,
//         {
//           title: cleanTitle,

//           description:
//             cleanDescription,

//           createdAt:
//             serverTimestamp(),

//           updatedAt:
//             serverTimestamp(),
//         },
//       );


//       // Clear form

//       setTitle('');

//       setDescription('');

//     } catch (error) {

//       console.log(
//         'ADD NOTE ERROR:',
//         error,
//       );

//       Alert.alert(
//         'Error',
//         error?.message ||
//           'Unable to create note.',
//       );

//     } finally {

//       setSaving(false);
//     }
//   };


//   // =====================================================
//   // OPEN EDIT MODAL
//   // =====================================================

//   const handleOpenEdit = note => {

//     console.log(
//       'EDIT NOTE:',
//       note,
//     );


//     setEditingNote(note);

//     setEditTitle(
//       note.title || '',
//     );

//     setEditDescription(
//       note.description || '',
//     );

//     setEditModalVisible(true);
//   };


//   // =====================================================
//   // CLOSE EDIT MODAL
//   // =====================================================

//   const handleCloseEdit = () => {

//     setEditModalVisible(false);

//     setEditingNote(null);

//     setEditTitle('');

//     setEditDescription('');
//   };


//   // =====================================================
//   // UPDATE NOTE
//   // =====================================================

//   const handleUpdateNote = async () => {

//     const cleanTitle =
//       editTitle.trim();

//     const cleanDescription =
//       editDescription.trim();


//     if (!cleanTitle) {

//       Alert.alert(
//         'Error',
//         'Please enter a note title.',
//       );

//       return;
//     }


//     if (!editingNote) {

//       Alert.alert(
//         'Error',
//         'No note selected.',
//       );

//       return;
//     }


//     if (!user?.uid) {

//       Alert.alert(
//         'Error',
//         'User is not authenticated.',
//       );

//       return;
//     }


//     try {

//       setUpdating(true);


//       console.log(
//         'UPDATING NOTE:',
//         editingNote.id,
//       );


//       // ==========================================
//       // Reference existing Firestore document
//       // ==========================================

//       const noteRef = doc(
//         firestore,
//         'users',
//         user.uid,
//         'notes',
//         editingNote.id,
//       );


//       // ==========================================
//       // Update document
//       // ==========================================

//       await updateDoc(
//         noteRef,
//         {
//           title: cleanTitle,

//           description:
//             cleanDescription,

//           updatedAt:
//             serverTimestamp(),
//         },
//       );


//       console.log(
//         'NOTE UPDATED SUCCESSFULLY',
//       );


//       // Close modal

//       handleCloseEdit();

//     } catch (error) {

//       console.log(
//         'UPDATE NOTE ERROR:',
//         error,
//       );

//       Alert.alert(
//         'Update Failed',
//         error?.message ||
//           'Unable to update note.',
//       );

//     } finally {

//       setUpdating(false);
//     }
//   };


//   // =====================================================
//   // DELETE NOTE
//   // =====================================================

//   const handleDeleteNote = noteId => {

//     Alert.alert(
//       'Delete Note',

//       'Are you sure you want to delete this note?',

//       [
//         {
//           text: 'Cancel',

//           style: 'cancel',
//         },

//         {
//           text: 'Delete',

//           style: 'destructive',

//           onPress: async () => {

//             try {

//               if (!user?.uid) {
//                 return;
//               }


//               const noteRef = doc(
//                 firestore,
//                 'users',
//                 user.uid,
//                 'notes',
//                 noteId,
//               );


//               await deleteDoc(
//                 noteRef,
//               );


//               console.log(
//                 'NOTE DELETED:',
//                 noteId,
//               );

//             } catch (error) {

//               console.log(
//                 'DELETE NOTE ERROR:',
//                 error,
//               );

//               Alert.alert(
//                 'Delete Failed',
//                 error?.message ||
//                   'Unable to delete note.',
//               );
//             }
//           },
//         },
//       ],
//     );
//   };


//   // =====================================================
//   // SEARCH + SORT
//   // =====================================================

//   const filteredNotes = useMemo(() => {

//     const searchText =
//       search.trim().toLowerCase();


//     // ==========================================
//     // SEARCH
//     // ==========================================

//     let result = notes.filter(note => {

//       if (!searchText) {

//         return true;
//       }


//       const noteTitle =
//         note.title?.toLowerCase() || '';


//       const noteDescription =
//         note.description?.toLowerCase() || '';


//       return (
//         noteTitle.includes(searchText) ||
//         noteDescription.includes(searchText)
//       );
//     });


//     // ==========================================
//     // SORT
//     // ==========================================

//     result.sort((a, b) => {

//       const timeA =
//         a.createdAt?.toDate?.()?.getTime() || 0;


//       const timeB =
//         b.createdAt?.toDate?.()?.getTime() || 0;


//       if (sortOrder === 'newest') {

//         return timeB - timeA;
//       }


//       return timeA - timeB;
//     });


//     return result;

//   }, [
//     notes,
//     search,
//     sortOrder,
//   ]);


//   // =====================================================
//   // RENDER NOTE
//   // =====================================================

//   const renderNote = ({
//     item,
//   }) => {

//     return (
//       <View style={styles.noteCard}>

//         {/* ==========================================
//             Note Content
//         ========================================== */}

//         <View style={styles.noteContent}>

//           <Text style={styles.noteTitle}>
//             {item.title}
//           </Text>


//           {!!item.description && (

//             <Text
//               style={styles.noteDescription}
//               numberOfLines={3}
//             >
//               {item.description}
//             </Text>

//           )}

//         </View>


//         {/* ==========================================
//             Actions
//         ========================================== */}

//         <View style={styles.actions}>

//           <TouchableOpacity
//             onPress={() =>
//               handleOpenEdit(item)
//             }
//           >

//             <Text style={styles.editText}>
//               Edit
//             </Text>

//           </TouchableOpacity>


//           <TouchableOpacity
//             onPress={() =>
//               handleDeleteNote(item.id)
//             }
//           >

//             <Text style={styles.deleteText}>
//               Delete
//             </Text>

//           </TouchableOpacity>

//         </View>

//       </View>
//     );
//   };


//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {

//     return (
//       <View style={styles.loadingContainer}>

//         <ActivityIndicator
//           size="large"
//           color="#2563eb"
//         />

//       </View>
//     );
//   }


//   // =====================================================
//   // SCREEN
//   // =====================================================

//   return (
//     <View style={styles.container}>

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <Text style={styles.title}>
//         My Notes
//       </Text>


//       {/* =================================================
//           SEARCH
//       ================================================= */}

//       <View style={styles.searchContainer}>

//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search notes..."
//           placeholderTextColor="#9ca3af"
//           value={search}
//           onChangeText={setSearch}
//         />


//         {search.length > 0 && (

//           <TouchableOpacity
//             onPress={() =>
//               setSearch('')
//             }
//           >

//             <Text style={styles.clearText}>
//               Clear
//             </Text>

//           </TouchableOpacity>

//         )}

//       </View>


//       {/* =================================================
//           SORT
//       ================================================= */}

//       <View style={styles.sortContainer}>

//         <Text style={styles.sortLabel}>
//           Sort:
//         </Text>


//         <TouchableOpacity
//           style={[
//             styles.sortButton,

//             sortOrder === 'newest' &&
//               styles.activeSortButton,
//           ]}
//           onPress={() =>
//             setSortOrder('newest')
//           }
//         >

//           <Text
//             style={[
//               styles.sortText,

//               sortOrder === 'newest' &&
//                 styles.activeSortText,
//             ]}
//           >
//             Newest
//           </Text>

//         </TouchableOpacity>


//         <TouchableOpacity
//           style={[
//             styles.sortButton,

//             sortOrder === 'oldest' &&
//               styles.activeSortButton,
//           ]}
//           onPress={() =>
//             setSortOrder('oldest')
//           }
//         >

//           <Text
//             style={[
//               styles.sortText,

//               sortOrder === 'oldest' &&
//                 styles.activeSortText,
//             ]}
//           >
//             Oldest
//           </Text>

//         </TouchableOpacity>

//       </View>


//       {/* =================================================
//           ADD NOTE FORM
//       ================================================= */}

//       <View style={styles.form}>

//         <TextInput
//           style={styles.input}
//           placeholder="Note title"
//           placeholderTextColor="#9ca3af"
//           value={title}
//           onChangeText={setTitle}
//         />


//         <TextInput
//           style={[
//             styles.input,
//             styles.descriptionInput,
//           ]}
//           placeholder="Note description"
//           placeholderTextColor="#9ca3af"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//           textAlignVertical="top"
//         />


//         <TouchableOpacity
//           style={[
//             styles.addButton,

//             saving &&
//               styles.disabledButton,
//           ]}
//           onPress={handleAddNote}
//           disabled={saving}
//         >

//           {saving ? (

//             <ActivityIndicator
//               color="#fff"
//             />

//           ) : (

//             <Text style={styles.addButtonText}>
//               Add Note
//             </Text>

//           )}

//         </TouchableOpacity>

//       </View>


//       {/* =================================================
//           RESULT COUNT
//       ================================================= */}

//       <Text style={styles.resultCount}>

//         {filteredNotes.length}{' '}

//         {filteredNotes.length === 1
//           ? 'note'
//           : 'notes'}

//       </Text>


//       {/* =================================================
//           NOTES LIST
//       ================================================= */}

//       <FlatList
//         data={filteredNotes}

//         keyExtractor={item =>
//           item.id
//         }

//         renderItem={renderNote}

//         contentContainerStyle={
//           filteredNotes.length === 0
//             ? styles.emptyContainer
//             : styles.listContainer
//         }

//         ListEmptyComponent={

//           <Text style={styles.emptyText}>

//             {search.trim()
//               ? 'No notes match your search.'
//               : 'No notes yet.'}

//           </Text>

//         }
//       />


//       {/* =================================================
//           EDIT MODAL
//       ================================================= */}

//       <Modal
//         visible={editModalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={
//           handleCloseEdit
//         }
//       >

//         <View style={styles.modalOverlay}>

//           <View style={styles.modalContainer}>

//             {/* ==========================================
//                 Modal Header
//             ========================================== */}

//             <Text style={styles.modalTitle}>
//               Edit Note
//             </Text>


//             {/* ==========================================
//                 Title
//             ========================================== */}

//             <Text style={styles.label}>
//               Title
//             </Text>


//             <TextInput
//               style={styles.input}
//               placeholder="Note title"
//               placeholderTextColor="#9ca3af"
//               value={editTitle}
//               onChangeText={setEditTitle}
//             />


//             {/* ==========================================
//                 Description
//             ========================================== */}

//             <Text style={styles.label}>
//               Description
//             </Text>


//             <TextInput
//               style={[
//                 styles.input,
//                 styles.modalDescription,
//               ]}
//               placeholder="Note description"
//               placeholderTextColor="#9ca3af"
//               value={editDescription}
//               onChangeText={setEditDescription}
//               multiline
//               textAlignVertical="top"
//             />


//             {/* ==========================================
//                 Buttons
//             ========================================== */}

//             <View style={styles.modalButtons}>

//               {/* ========================================
//                   Cancel
//               ======================================== */}

//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={
//                   handleCloseEdit
//                 }
//                 disabled={updating}
//               >

//                 <Text style={styles.cancelText}>
//                   Cancel
//                 </Text>

//               </TouchableOpacity>


//               {/* ========================================
//                   Update
//               ======================================== */}

//               <TouchableOpacity
//                 style={[
//                   styles.updateButton,

//                   updating &&
//                     styles.disabledButton,
//                 ]}
//                 onPress={
//                   handleUpdateNote
//                 }
//                 disabled={updating}
//               >

//                 {updating ? (

//                   <ActivityIndicator
//                     color="#fff"
//                   />

//                 ) : (

//                   <Text style={styles.updateText}>
//                     Update
//                   </Text>

//                 )}

//               </TouchableOpacity>

//             </View>

//           </View>

//         </View>

//       </Modal>

//     </View>
//   );
// }


// export default NotesScreen;


// // =====================================================
// // STYLES
// // =====================================================

// const styles = StyleSheet.create({

//   // ===================================================
//   // Main
//   // ===================================================

//   container: {
//     flex: 1,
//     backgroundColor: '#f5f7fb',
//     padding: 20,
//   },

//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },


//   // ===================================================
//   // Header
//   // ===================================================

//   title: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 15,
//   },


//   // ===================================================
//   // Search
//   // ===================================================

//   searchContainer: {
//     height: 50,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     marginBottom: 12,
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//   },

//   clearText: {
//     color: '#2563eb',
//     fontWeight: '600',
//   },


//   // ===================================================
//   // Sort
//   // ===================================================

//   sortContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },

//   sortLabel: {
//     color: '#374151',
//     fontWeight: '600',
//     marginRight: 10,
//   },

//   sortButton: {
//     paddingHorizontal: 14,
//     paddingVertical: 7,
//     borderRadius: 20,
//     backgroundColor: '#e5e7eb',
//     marginRight: 8,
//   },

//   activeSortButton: {
//     backgroundColor: '#2563eb',
//   },

//   sortText: {
//     color: '#374151',
//     fontWeight: '600',
//   },

//   activeSortText: {
//     color: '#fff',
//   },


//   // ===================================================
//   // Add Form
//   // ===================================================

//   form: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 14,
//     marginBottom: 12,
//   },

//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     color: '#111827',
//     fontSize: 16,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },

//   descriptionInput: {
//     height: 80,
//     paddingTop: 14,
//   },

//   addButton: {
//     height: 50,
//     borderRadius: 10,
//     backgroundColor: '#2563eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   disabledButton: {
//     opacity: 0.6,
//   },

//   addButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },


//   // ===================================================
//   // Count
//   // ===================================================

//   resultCount: {
//     color: '#6b7280',
//     fontSize: 14,
//     marginBottom: 8,
//   },


//   // ===================================================
//   // List
//   // ===================================================

//   listContainer: {
//     paddingBottom: 30,
//   },

//   emptyContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   emptyText: {
//     color: '#9ca3af',
//     fontSize: 16,
//     textAlign: 'center',
//   },


//   // ===================================================
//   // Note Card
//   // ===================================================

//   noteCard: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   noteContent: {
//     flex: 1,
//     marginRight: 10,
//   },

//   noteTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 5,
//   },

//   noteDescription: {
//     fontSize: 14,
//     color: '#6b7280',
//     lineHeight: 20,
//   },


//   // ===================================================
//   // Note Actions
//   // ===================================================

//   actions: {
//     alignItems: 'flex-end',
//     gap: 12,
//   },

//   editText: {
//     color: '#2563eb',
//     fontWeight: '600',
//   },

//   deleteText: {
//     color: '#dc2626',
//     fontWeight: '600',
//   },


//   // ===================================================
//   // Edit Modal
//   // ===================================================

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     padding: 20,
//   },

//   modalContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 20,
//   },

//   modalTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 20,
//   },

//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 7,
//   },

//   modalDescription: {
//     height: 100,
//     paddingTop: 14,
//   },

//   modalButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 10,
//   },

//   cancelButton: {
//     flex: 1,
//     height: 50,
//     borderRadius: 10,
//     backgroundColor: '#e5e7eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   cancelText: {
//     color: '#374151',
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   updateButton: {
//     flex: 1,
//     height: 50,
//     borderRadius: 10,
//     backgroundColor: '#2563eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   updateText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },

// });



import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from 'react-native';

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

import {
  useAuth,
} from '../context/AuthContext';


// =====================================================
// Constants
// =====================================================

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 2000;


// Firestore instance is created once for this module instead
// of requesting the instance during every component render.
const firestore = getFirestore();


// =====================================================
// Notes Screen
// =====================================================
//
// Responsibilities:
//
// - Subscribe to the authenticated user's notes.
// - Create notes.
// - Update notes.
// - Delete notes.
// - Search notes locally.
// - Sort notes locally.
// - Display an edit modal.
//
// Firebase authentication remains inside AuthContext.
// Firestore operations are scoped to the authenticated
// user's UID.
//
// IMPORTANT:
// Firestore Security Rules must also enforce that a user
// can only read/write their own notes. Client-side UID
// checks are not a security boundary.
//
function NotesScreen() {

  const {
    user,
  } = useAuth();


  // =====================================================
  // Subscription / Lifecycle State
  // =====================================================
  //
  // A ref allows asynchronous callbacks to determine
  // whether the component is still mounted before
  // updating UI state.
  const isMountedRef = useRef(true);


  useEffect(() => {

    return () => {

      isMountedRef.current = false;
    };

  }, []);


  // =====================================================
  // Notes State
  // =====================================================

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // Add Note State
  // =====================================================

  const [title, setTitle] = useState('');

  const [description, setDescription] =
    useState('');

  const [saving, setSaving] =
    useState(false);


  // =====================================================
  // Edit Note State
  // =====================================================

  const [editModalVisible, setEditModalVisible] =
    useState(false);

  const [editingNote, setEditingNote] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState('');

  const [editDescription, setEditDescription] =
    useState('');

  const [updating, setUpdating] =
    useState(false);


  // =====================================================
  // Delete State
  // =====================================================
  //
  // Store the ID instead of a boolean so only the note
  // currently being deleted displays a loading state.
  const [deletingNoteId, setDeletingNoteId] =
    useState(null);


  // =====================================================
  // Search / Sort State
  // =====================================================

  const [search, setSearch] =
    useState('');

  const [sortOrder, setSortOrder] =
    useState('newest');


  // =====================================================
  // Firestore Real-Time Listener
  // =====================================================
  //
  // onSnapshot establishes a real-time subscription.
  //
  // The returned unsubscribe function is critical:
  // without it, the listener can continue receiving
  // updates after the screen is no longer active.
  useEffect(() => {

    // No authenticated user means there is no collection
    // that this screen should subscribe to.
    if (!user?.uid) {

      setNotes([]);

      setLoading(false);

      return undefined;
    }


    setLoading(true);


    const notesRef = collection(
      firestore,
      'users',
      user.uid,
      'notes',
    );


    const unsubscribe = onSnapshot(
      notesRef,

      snapshot => {

        if (!isMountedRef.current) {
          return;
        }


        const notesData =
          snapshot.docs.map(noteDoc => ({

            id: noteDoc.id,

            ...noteDoc.data(),

          }));


        setNotes(notesData);

        setLoading(false);
      },

      error => {

        console.error(
          'LOAD NOTES ERROR:',
          error,
        );


        if (!isMountedRef.current) {
          return;
        }


        setLoading(false);

        Alert.alert(
          'Unable to Load Notes',
          'We could not load your notes. Please try again.',
        );
      },
    );


    // Firestore subscription cleanup.
    return unsubscribe;

  }, [user?.uid]);


  // =====================================================
  // Input Validation
  // =====================================================

  const validateNote = (
    noteTitle,
    noteDescription,
  ) => {

    const cleanTitle =
      noteTitle.trim();

    const cleanDescription =
      noteDescription.trim();


    if (!cleanTitle) {

      Alert.alert(
        'Title Required',
        'Please enter a note title.',
      );

      return null;
    }


    if (
      cleanTitle.length >
      MAX_TITLE_LENGTH
    ) {

      Alert.alert(
        'Title Too Long',
        `The title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
      );

      return null;
    }


    if (
      cleanDescription.length >
      MAX_DESCRIPTION_LENGTH
    ) {

      Alert.alert(
        'Description Too Long',
        `The description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
      );

      return null;
    }


    return {
      title: cleanTitle,
      description: cleanDescription,
    };
  };


  // =====================================================
  // Add Note
  // =====================================================

  const handleAddNote = async () => {

    // Prevent duplicate submissions.
    if (saving) {
      return;
    }


    if (!user?.uid) {

      Alert.alert(
        'Authentication Required',
        'Please sign in again before creating a note.',
      );

      return;
    }


    const validatedNote =
      validateNote(
        title,
        description,
      );


    if (!validatedNote) {
      return;
    }


    try {

      setSaving(true);


      const notesRef = collection(
        firestore,
        'users',
        user.uid,
        'notes',
      );


      await addDoc(
        notesRef,
        {
          title:
            validatedNote.title,

          description:
            validatedNote.description,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        },
      );


      if (!isMountedRef.current) {
        return;
      }


      // The Firestore listener will add the new document
      // to the local notes state. We only clear the form here.
      setTitle('');
      setDescription('');

    } catch (error) {

      console.error(
        'ADD NOTE ERROR:',
        error,
      );


      if (!isMountedRef.current) {
        return;
      }


      Alert.alert(
        'Create Failed',
        'Unable to create the note. Please try again.',
      );

    } finally {

      if (isMountedRef.current) {

        setSaving(false);
      }
    }
  };


  // =====================================================
  // Open Edit Modal
  // =====================================================

  const handleOpenEdit = useCallback(note => {

    if (!note?.id) {
      return;
    }


    setEditingNote(note);

    setEditTitle(
      typeof note.title === 'string'
        ? note.title
        : '',
    );

    setEditDescription(
      typeof note.description === 'string'
        ? note.description
        : '',
    );

    setEditModalVisible(true);

  }, []);


  // =====================================================
  // Close Edit Modal
  // =====================================================

  const handleCloseEdit = useCallback(() => {

    // Do not allow the user to discard an update that is
    // currently being submitted.
    if (updating) {
      return;
    }


    setEditModalVisible(false);

    setEditingNote(null);

    setEditTitle('');

    setEditDescription('');

  }, [updating]);


  // =====================================================
  // Update Note
  // =====================================================

  const handleUpdateNote = async () => {

    if (updating) {
      return;
    }


    if (!user?.uid) {

      Alert.alert(
        'Authentication Required',
        'Please sign in again before updating a note.',
      );

      return;
    }


    if (!editingNote?.id) {

      Alert.alert(
        'Update Failed',
        'The selected note could not be found.',
      );

      return;
    }


    const validatedNote =
      validateNote(
        editTitle,
        editDescription,
      );


    if (!validatedNote) {
      return;
    }


    try {

      setUpdating(true);


      const noteRef = doc(
        firestore,
        'users',
        user.uid,
        'notes',
        editingNote.id,
      );


      await updateDoc(
        noteRef,
        {
          title:
            validatedNote.title,

          description:
            validatedNote.description,

          updatedAt:
            serverTimestamp(),
        },
      );


      if (!isMountedRef.current) {
        return;
      }


      // The real-time Firestore listener will update the
      // visible list automatically.
      setEditModalVisible(false);

      setEditingNote(null);

      setEditTitle('');

      setEditDescription('');

    } catch (error) {

      console.error(
        'UPDATE NOTE ERROR:',
        error,
      );


      if (!isMountedRef.current) {
        return;
      }


      Alert.alert(
        'Update Failed',
        'Unable to update the note. Please try again.',
      );

    } finally {

      if (isMountedRef.current) {

        setUpdating(false);
      }
    }
  };


  // =====================================================
  // Delete Note
  // =====================================================

  const handleDeleteNote = useCallback(
    noteId => {

      if (!noteId) {
        return;
      }


      if (deletingNoteId) {
        return;
      }


      Alert.alert(
        'Delete Note',
        'Are you sure you want to delete this note?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Delete',
            style: 'destructive',

            onPress: async () => {

              if (!user?.uid) {

                Alert.alert(
                  'Authentication Required',
                  'Please sign in again before deleting a note.',
                );

                return;
              }


              try {

                setDeletingNoteId(noteId);


                const noteRef = doc(
                  firestore,
                  'users',
                  user.uid,
                  'notes',
                  noteId,
                );


                await deleteDoc(
                  noteRef,
                );


              } catch (error) {

                console.error(
                  'DELETE NOTE ERROR:',
                  error,
                );


                if (
                  isMountedRef.current
                ) {

                  Alert.alert(
                    'Delete Failed',
                    'Unable to delete the note. Please try again.',
                  );
                }

              } finally {

                if (
                  isMountedRef.current
                ) {

                  setDeletingNoteId(null);
                }
              }
            },
          },
        ],
      );
    },
    [
      deletingNoteId,
      user?.uid,
    ],
  );


  // =====================================================
  // Search + Sort
  // =====================================================
  //
  // useMemo avoids recalculating the filtered/sorted
  // collection when unrelated component state changes.
  const filteredNotes = useMemo(() => {

    const searchText =
      search.trim().toLowerCase();


    const result =
      notes.filter(note => {

        if (!searchText) {
          return true;
        }


        const noteTitle =
          typeof note.title === 'string'
            ? note.title.toLowerCase()
            : '';


        const noteDescription =
          typeof note.description === 'string'
            ? note.description.toLowerCase()
            : '';


        return (
          noteTitle.includes(searchText) ||
          noteDescription.includes(searchText)
        );
      });


    result.sort((a, b) => {

      const timeA =
        a.createdAt?.toMillis?.() ??
        a.createdAt?.toDate?.()?.getTime?.() ??
        0;


      const timeB =
        b.createdAt?.toMillis?.() ??
        b.createdAt?.toDate?.()?.getTime?.() ??
        0;


      return sortOrder === 'newest'
        ? timeB - timeA
        : timeA - timeB;
    });


    return result;

  }, [
    notes,
    search,
    sortOrder,
  ]);


  // =====================================================
  // Render Note
  // =====================================================

  const renderNote = useCallback(
    ({item}) => {

      const isDeleting =
        deletingNoteId === item.id;


      return (
        <View
          style={styles.noteCard}
        >

          <View
            style={styles.noteContent}
          >

            <Text
              style={styles.noteTitle}
              numberOfLines={2}
            >
              {item.title}
            </Text>


            {!!item.description && (

              <Text
                style={
                  styles.noteDescription
                }
                numberOfLines={3}
              >
                {item.description}
              </Text>

            )}

          </View>


          <View
            style={styles.actions}
          >

            {/* Edit remains unavailable while this note
                is being deleted. */}
            <Pressable
              onPress={() =>
                handleOpenEdit(item)
              }
              disabled={
                !!deletingNoteId ||
                updating
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                `Edit note ${item.title}`
              }
              accessibilityState={{
                disabled:
                  !!deletingNoteId ||
                  updating,
              }}
            >

              <Text
                style={[
                  styles.editText,
                  (
                    !!deletingNoteId ||
                    updating
                  ) &&
                    styles.disabledText,
                ]}
              >
                Edit
              </Text>

            </Pressable>


            <Pressable
              onPress={() =>
                handleDeleteNote(item.id)
              }
              disabled={
                !!deletingNoteId ||
                updating
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                `Delete note ${item.title}`
              }
              accessibilityState={{
                disabled:
                  !!deletingNoteId ||
                  updating,
                  busy: isDeleting,
              }}
            >

              {isDeleting ? (

                <ActivityIndicator
                  size="small"
                  color="#dc2626"
                />

              ) : (

                <Text
                  style={[
                    styles.deleteText,
                    (
                      !!deletingNoteId ||
                      updating
                    ) &&
                      styles.disabledText,
                  ]}
                >
                  Delete
                </Text>
              )}

            </Pressable>

          </View>

        </View>
      );
    },
    [
      deletingNoteId,
      handleDeleteNote,
      handleOpenEdit,
      updating,
    ],
  );


  // =====================================================
  // Loading State
  // =====================================================

  if (loading) {

    return (
      <View
        style={styles.loadingContainer}
      >

        <ActivityIndicator
          size="large"
          color="#2563eb"
          accessibilityLabel="Loading notes"
        />

      </View>
    );
  }


  // =====================================================
  // Screen
  // =====================================================

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      <View style={styles.container}>

        {/* =================================================
            Header
            ================================================= */}
        <Text
          style={styles.title}
          accessibilityRole="header"
        >
          My Notes
        </Text>


        {/* =================================================
            Search
            ================================================= */}
        <View
          style={styles.searchContainer}
        >

          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search notes"
          />


          {search.length > 0 && (

            <Pressable
              onPress={() =>
                setSearch('')
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear note search"
            >

              <Text
                style={styles.clearText}
              >
                Clear
              </Text>

            </Pressable>

          )}

        </View>


        {/* =================================================
            Sort
            ================================================= */}
        <View
          style={styles.sortContainer}
        >

          <Text
            style={styles.sortLabel}
          >
            Sort:
          </Text>


          <Pressable
            style={[
              styles.sortButton,
              sortOrder === 'newest' &&
                styles.activeSortButton,
            ]}
            onPress={() =>
              setSortOrder('newest')
            }
            accessibilityRole="button"
            accessibilityLabel="Sort newest first"
            accessibilityState={{
              selected:
                sortOrder === 'newest',
            }}
          >

            <Text
              style={[
                styles.sortText,
                sortOrder === 'newest' &&
                  styles.activeSortText,
              ]}
            >
              Newest
            </Text>

          </Pressable>


          <Pressable
            style={[
              styles.sortButton,
              sortOrder === 'oldest' &&
                styles.activeSortButton,
            ]}
            onPress={() =>
              setSortOrder('oldest')
            }
            accessibilityRole="button"
            accessibilityLabel="Sort oldest first"
            accessibilityState={{
              selected:
                sortOrder === 'oldest',
            }}
          >

            <Text
              style={[
                styles.sortText,
                sortOrder === 'oldest' &&
                  styles.activeSortText,
              ]}
            >
              Oldest
            </Text>

          </Pressable>

        </View>


        {/* =================================================
            Add Note Form
            ================================================= */}
        <View style={styles.form}>

          <TextInput
            style={styles.input}
            placeholder="Note title"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
            maxLength={MAX_TITLE_LENGTH}
            editable={!saving}
            returnKeyType="next"
            accessibilityLabel="Note title"
          />


          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
            placeholder="Note description"
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            maxLength={
              MAX_DESCRIPTION_LENGTH
            }
            editable={!saving}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Note description"
          />


          <Pressable
            style={({pressed}) => [
              styles.addButton,

              saving &&
                styles.disabledButton,

              pressed &&
                !saving &&
                styles.pressedButton,
            ]}
            onPress={handleAddNote}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Add note"
            accessibilityState={{
              disabled: saving,
              busy: saving,
            }}
          >

            {saving ? (

              <ActivityIndicator
                color="#ffffff"
                accessibilityLabel="Creating note"
              />

            ) : (

              <Text
                style={styles.addButtonText}
              >
                Add Note
              </Text>

            )}

          </Pressable>

        </View>


        {/* =================================================
            Result Count
            ================================================= */}
        <Text
          style={styles.resultCount}
          accessibilityLiveRegion="polite"
        >
          {filteredNotes.length}{' '}
          {filteredNotes.length === 1
            ? 'note'
            : 'notes'}
        </Text>


        {/* =================================================
            Notes List
            ================================================= */}
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          renderItem={renderNote}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredNotes.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
          ListEmptyComponent={

            <Text
              style={styles.emptyText}
            >
              {search.trim()
                ? 'No notes match your search.'
                : 'No notes yet.'}
            </Text>

          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={
            Platform.OS === 'android'
          }
        />


        {/* =================================================
            Edit Modal
            ================================================= */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={
            handleCloseEdit
          }
        >

          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={
              Platform.OS === 'ios'
                ? 'padding'
                : undefined
            }
          >

            <View
              style={styles.modalContainer}
            >

              <Text
                style={styles.modalTitle}
                accessibilityRole="header"
              >
                Edit Note
              </Text>


              {/* Title */}
              <Text
                style={styles.label}
              >
                Title
              </Text>


              <TextInput
                style={styles.input}
                placeholder="Note title"
                placeholderTextColor="#9ca3af"
                value={editTitle}
                onChangeText={setEditTitle}
                maxLength={
                  MAX_TITLE_LENGTH
                }
                editable={!updating}
                accessibilityLabel="Edit note title"
              />


              {/* Description */}
              <Text
                style={styles.label}
              >
                Description
              </Text>


              <TextInput
                style={[
                  styles.input,
                  styles.modalDescription,
                ]}
                placeholder="Note description"
                placeholderTextColor="#9ca3af"
                value={editDescription}
                onChangeText={
                  setEditDescription
                }
                maxLength={
                  MAX_DESCRIPTION_LENGTH
                }
                editable={!updating}
                multiline
                textAlignVertical="top"
                accessibilityLabel="Edit note description"
              />


              {/* Modal actions */}
              <View
                style={styles.modalButtons}
              >

                <Pressable
                  style={({pressed}) => [
                    styles.cancelButton,

                    pressed &&
                      !updating &&
                      styles.pressedButton,
                  ]}
                  onPress={
                    handleCloseEdit
                  }
                  disabled={updating}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel editing note"
                  accessibilityState={{
                    disabled: updating,
                  }}
                >

                  <Text
                    style={styles.cancelText}
                  >
                    Cancel
                  </Text>

                </Pressable>


                <Pressable
                  style={({pressed}) => [
                    styles.updateButton,

                    updating &&
                      styles.disabledButton,

                    pressed &&
                      !updating &&
                      styles.pressedButton,
                  ]}
                  onPress={
                    handleUpdateNote
                  }
                  disabled={updating}
                  accessibilityRole="button"
                  accessibilityLabel="Update note"
                  accessibilityState={{
                    disabled: updating,
                    busy: updating,
                  }}
                >

                  {updating ? (

                    <ActivityIndicator
                      color="#ffffff"
                      accessibilityLabel="Updating note"
                    />

                  ) : (

                    <Text
                      style={styles.updateText}
                    >
                      Update
                    </Text>

                  )}

                </Pressable>

              </View>

            </View>

          </KeyboardAvoidingView>

        </Modal>

      </View>

    </KeyboardAvoidingView>
  );
}


export default NotesScreen;


// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  // Main
  // ===================================================

  keyboardContainer: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },


  // ===================================================
  // Header
  // ===================================================

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 15,
  },


  // ===================================================
  // Search
  // ===================================================

  searchContainer: {
    minHeight: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    minHeight: 48,
    fontSize: 16,
    color: '#111827',
  },

  clearText: {
    color: '#2563eb',
    fontWeight: '600',
  },


  // ===================================================
  // Sort
  // ===================================================

  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  sortLabel: {
    color: '#374151',
    fontWeight: '600',
    marginRight: 10,
  },

  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },

  activeSortButton: {
    backgroundColor: '#2563eb',
  },

  sortText: {
    color: '#374151',
    fontWeight: '600',
  },

  activeSortText: {
    color: '#ffffff',
  },


  // ===================================================
  // Add Form
  // ===================================================

  form: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#111827',
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },

  descriptionInput: {
    height: 80,
    paddingTop: 14,
  },

  addButton: {
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  disabledButton: {
    opacity: 0.6,
  },

  pressedButton: {
    opacity: 0.8,
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },


  // ===================================================
  // Result Count
  // ===================================================

  resultCount: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },


  // ===================================================
  // List
  // ===================================================

  listContainer: {
    paddingBottom: 30,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },

  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },


  // ===================================================
  // Note Card
  // ===================================================

  noteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  noteContent: {
    flex: 1,
    marginRight: 10,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },

  noteDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },


  // ===================================================
  // Note Actions
  // ===================================================

  actions: {
    alignItems: 'flex-end',
    gap: 12,
  },

  editText: {
    color: '#2563eb',
    fontWeight: '600',
  },

  deleteText: {
    color: '#dc2626',
    fontWeight: '600',
  },

  disabledText: {
    opacity: 0.5,
  },


  // ===================================================
  // Edit Modal
  // ===================================================

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 7,
  },

  modalDescription: {
    height: 100,
    paddingTop: 14,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  cancelButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
  },

  updateButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  updateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

});
