import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground, Alert } from 'react-native'
import Icons from 'react-native-vector-icons/FontAwesome';
import Icons2 from 'react-native-vector-icons/Entypo'
import Icons3 from 'react-native-vector-icons/AntDesign'
import { useEffect, useState } from 'react';
import Fallback from '../components/Fallback';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Snackbar from "react-native-snackbar"
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../../App';

const dummyData = [
    {
        id: "01",
        title: "Read car",
        img: "https://firebasestorage.googleapis.com/v0/b/tasklist-afa62.appspot.com/o/rn_image_picker_lib_temp_5e7253da-7d40-461e-8ed6-14c2a7ab1ec5.jpg?alt=media&token=d9f4e7ad-5944-4f27-95fa-f73a7fde4d39"
    },
    {
        id: "02",
        title: "Write car",
        img: "https://firebasestorage.googleapis.com/v0/b/tasklist-afa62.appspot.com/o/rn_image_picker_lib_temp_df3e0dde-d918-4b81-966d-b3c00cc6855a.jpg?alt=media&token=46a4e486-9a2a-4c56-9d38-f43b3b31143a"
    }
]

const ToDoScreen = () => {

    //Init local states
    const [toDo, setToDo] = useState("");
    const [toDoList, setToDoList] = useState([]);
    const [editedToDo, setEditedToDo] = useState(null);
    const [imgUri, setImgUri] = useState("");
    const [description, setDescription] = useState("");
    const [floatVisible, setFloatVisible] = useState(true);
    const [documentIDList, setDocumentIdList] = useState([])
    const [documentID, setDocumentId] = useState("")

    //Upload photo in firebase storage
    const uploadImage = async () => {
        const filename = imgUri.substring(imgUri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
        //setUploading(true);
        //setTransferred(0);
        const task = storage()
            .ref(filename)
            .putFile(uploadUri);
        // set progress state

        try {
            await task;
        } catch (e) {
            console.error(e);
        }
        const url = await storage().ref(filename).getDownloadURL();
        setImgUri(url)
        //setUploading(false);
        addTodo()
        // Alert.alert(
        //     'Photo uploaded!',
        //     'Your photo has been uploaded to Firebase Cloud Storage!'
        // );
        //setImage(null);
    };

    //Handle Float Visible
    const handleFloatVisible = () => {
        if (floatVisible) {
            setFloatVisible(false)
        } else {
            setFloatVisible(true)
        }
    }
    //Handle Add ToDo
    const handleAddToDo = () => {
        //strcture of a single ToDo item
        // {
        //     id:
        //     title:
        //     des:
        //     img:
        // }
        if (toDo == "" || description == "") {
            Snackbar.show({
                text: 'Please add both title and notes',
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        } else if (toDo.length >= 25) {
            Snackbar.show({
                text: '25 is Maximum letter allowed to write on title',
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        }
        //setToDoList([...toDoList, { id: Date.now().toString(), title: toDo, des: description, img: imgUri }])

        if (imgUri != "") {
            uploadImage()
        } else {
            addTodo()
        }

    }
    const addTodo = async () => {
        try {
            const docRef = await addDoc(collection(db, "toDo"), {
                id: Date.now().toString(),
                title: toDo,
                des: description,
                img: imgUri
            });
            setToDo("")
            setImgUri("")
            setDescription("")
            handleFloatVisible()
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    useEffect(() => {
        const subscriber = firestore()
            .collection('toDo')
            .onSnapshot(querySnapshot => {
                const users = [];
                const docId = [];

                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                    docId.push({
                        ...{ id: documentSnapshot.id },
                        key: documentSnapshot.id,
                    })
                });

                setToDoList(users);
                setDocumentIdList(docId)
                // setLoading(false);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    //Handle Delete ToDo
    const handleDeleteToDo = (index) => {
        // const updateToDoList = toDoList.filter((toDo) => toDo.id != id);
        // setToDoList(updateToDoList)
        firestore()
            .collection('toDo')
            .doc(documentIDList[index].id)
            .delete()
            .then(() => {
                console.log('User deleted!');
            });
        setToDo("")
        setImgUri("")
        setDescription("")
        setFloatVisible(true)
    }

    // Handle Edit todo
    const handleEditToDo = (toDo, index) => {
        setEditedToDo(toDo);
        setToDo(toDo.title);
        setImgUri(toDo.img)
        setDescription(toDo.des)
        setFloatVisible(false)
        setDocumentId(documentIDList[index].id)
    };

    // Handle Update
    const handleUpdateToDo = () => {
        if (toDo == "" || description == "") {
            Snackbar.show({
                text: 'Please add both title and notes',
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        } else if (toDo.length >= 25) {
            Snackbar.show({
                text: '25 is Maximum letter allowed to write on title',
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        }
        firestore()
            .collection('toDo')
            .doc(documentID)
            .update({
                title: toDo,
                des: description,
                img: imgUri
            })
            .then(() => {
                console.log('User updated!');
            });
        // const updatedTodos = toDoList.map((item) => {
        //     if (item.id === editedToDo.id) {
        //         return { ...item, title: toDo, des: description, img: imgUri };
        //     }

        //     return item;
        // });
        //setToDoList(updatedTodos);
        setEditedToDo(null);
        setToDo("");
        setImgUri("")
        setDescription("")
        handleFloatVisible()
    };

    // Handle Delete Image
    const handleDeleteImage = () => {
        setImgUri("")
    }

    // Handle Add Image
    const addImageFromCamera = async () => {
        const result = await launchCamera()
        console.log("RESULT====>" + result.assets[0].uri)
        setImgUri(result.assets[0].uri)
    }
    const addImageFromGallery = async () => {
        const result = await launchImageLibrary()
        console.log("RESULT====>" + result.assets[0].uri)
        setImgUri(result.assets[0].uri)
    }

    //Render ToDo
    const renderToDo = ({ item, index }) => {
        return (
            <View style={styles.renderViewStyle}>
                <View style={styles.renderTopViewStyle}>
                    <Text style={styles.renderTextStyle}>{item.title}</Text>
                    <TouchableOpacity
                        style={styles.renderTouchableOpacityStyle}
                        onPress={() => handleEditToDo(item, index)}
                    >
                        <Icons
                            name="pencil"
                            size={20}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.renderTouchableOpacityStyle}
                        onPress={() => handleDeleteToDo(index)}
                    >
                        <Icons2
                            name="trash"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.renderDesTextStyle}>{item.des}</Text>
                {item.img != "" && <ImageBackground source={{ uri: item.img }} resizeMode="cover" style={styles.imgStyle} />}
            </View>

        );
    }

    return (
        <View style={styles.viewStyle}>
            {!floatVisible && <View style={styles.inputViewStyle}>
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Add title"
                    value={toDo}
                    onChangeText={(userText) => setToDo(userText)}
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Add notes"
                    value={description}
                    onChangeText={(userText) => setDescription(userText)}
                />
                {imgUri == "" ?
                    <View style={styles.buttonsViewStyle}>
                        <TouchableOpacity
                            style={styles.buttonsTouchableOpacityStyle}
                            onPress={() => addImageFromCamera()}
                        >
                            <Text style={styles.textStyle}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonsTouchableOpacityStyle}
                            onPress={() => addImageFromGallery()}
                        >
                            <Text style={styles.textStyle}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    : <View>
                        <ImageBackground source={{ uri: imgUri }} resizeMode="cover" style={styles.imgStyle} >
                            <TouchableOpacity
                                style={styles.renderCloseTouchableOpacityStyle}
                                onPress={() => handleDeleteImage()}
                            >
                                <Icons3
                                    name="close"
                                    color="red"
                                    size={25}
                                />
                            </TouchableOpacity>
                        </ImageBackground>

                    </View>
                }

                {editedToDo ?
                    <TouchableOpacity
                        style={styles.touchableOpacityStyle}
                        onPress={() => handleUpdateToDo()}
                    >
                        <Text style={styles.textStyle}>Save</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity
                        style={styles.touchableOpacityStyle}
                        onPress={() => handleAddToDo()}
                    >
                        <Text style={styles.textStyle}>Add Note</Text>
                    </TouchableOpacity>}
            </View>}
            {toDoList.length <= 0 && <Fallback />}
            {/* Render Todo list */}
            <View style={{ flex: 1 }}>
                <FlatList data={toDoList} renderItem={renderToDo} />
            </View>
            {floatVisible && <TouchableOpacity style={styles.floatViewStyle} onPress={() => handleFloatVisible()}>
                <Icons name='plus' size={25} color='#1e90ff' />
            </TouchableOpacity>}
        </View>

    );
};

const styles = StyleSheet.create({
    viewStyle: {
        marginHorizontal: 16,
        marginVertical: 8,
        flex: 1
    },
    floatViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        position: 'absolute',
        bottom: 10,
        right: 10,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 100,
    },
    buttonsViewStyle: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    buttonsTouchableOpacityStyle: {
        backgroundColor: "#000",
        borderRadius: 6,
        paddingVertical: 8,
        alignItems: "center",
        marginVertical: 12,
        marginHorizontal: 2,
        flex: 1,
    },
    imgStyle: {
        height: 200,
        width: "100%",
        marginTop: 8
    },
    inputViewStyle: {
        backgroundColor: "white",
        padding: 8,
        marginVertical: 12,
    },
    inputStyle: {
        borderWidth: 2,
        borderColor: "#1e90ff",
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: 12,
    },
    touchableOpacityStyle: {
        backgroundColor: "#000",
        borderRadius: 6,
        paddingVertical: 8,
        alignItems: "center",
        marginVertical: 12,
    },
    textStyle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "800"
    },
    renderViewStyle: {
        backgroundColor: "white",
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    renderTopViewStyle: {
        flexDirection: "row",
        marginBottom: 8
    },
    renderTextStyle: {
        fontSize: 18,
        fontWeight: "600",
        flex: 1,
    },
    renderDesTextStyle: {
        alignItems: "flex-start",
        alignContent: "flex-start"
    },
    renderTouchableOpacityStyle: {
        paddingHorizontal: 12,
    },
    renderCloseTouchableOpacityStyle: {
        backgroundColor: "black",
        alignSelf: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 8,
        margin: 8,
        borderRadius: 25,
    }
})

export default ToDoScreen;

