import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./app/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "./app/screens/ProfileScreen";
import ToDoScreen from "./app/screens/ToDoScreen";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


function App(){
  const Stack= createNativeStackNavigator()
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ToDo">
      <Stack.Screen name="ToDo" component={ToDoScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Profile" component={ProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const firebaseConfig = {
  apiKey: "AIzaSyCoVc8dBMgAxUuIAcDnv4HUg7-xi7_DeQQ",
  authDomain: "tasklist-afa62.firebaseapp.com",
  projectId: "tasklist-afa62",
  storageBucket: "tasklist-afa62.appspot.com",
  messagingSenderId: "429397322171",
  appId: "1:429397322171:web:3d70147c8d4cdeba15bc9e",
  measurementId: "G-QDFYXEFBPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default App;