import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View,TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Pressable, TextInput, ScrollView } from 'react-native';
import { theme } from './color';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
//TouochableOpacity 는 view와 동일한 박스인데 누르는 이벤트를 받을수 있는view
const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () =>  setWorking(true);
  const onChangeText = (payload) => setText(payload);

  const loadToDos = async() =>{
   const s =  await AsyncStorage.getItem(STORAGE_KEY);
   setToDos(JSON.parse(s));
  }
    //mount 되면 storage에서 todo를 가져옴
    useState(()=>{loadToDos();},[]);

  const addToDos = async() => {
    if(text===''){
      return;
    }
    const newToDos = {...toDos, [Date.now()]: {text, working}};
    setToDos(newToDos);
    setText('');
    await saveToDos(newToDos);
  }

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }
  const deleteToDo = async(key) => {
    Alert.alert("Delete To Do", "Are You Sure?", [
      {text: 'Cancel'},
      {text: "I'm Sure", 
      style: 'destructive',
      onPress: async() => {
        const newToDos = {...toDos}
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      },
    },
  ]);
   
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? 'white' : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText,  color: !working ? 'white' : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput 
        onChangeText={onChangeText}
        onSubmitEditing={addToDos}
        style={styles.input} 
        value={text}
        placeholder={working ? 'add a todo': 'where do you want to go?'}
        returnKeyType='done'
        ></TextInput>
        <ScrollView>
          {
            Object.keys(toDos).map((key) => (
              toDos[key].working === working ?
              (
                <View style={styles.toDo} key={key}>
                  <Text style={styles.toDoText}>{toDos[key].text}</Text>
                  <TouchableOpacity onPress={() => {deleteToDo(key)}}>
                    <Text><Fontisto name="trash" size={18} color={theme.grey} /></Text>
                  </TouchableOpacity>
                </View>
              ) : null
            ))
          }
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent:'space-between',
    flexDirection:'row',
    marginTop:100,
  },
  btnText:{
    fontSize:40,
    fontWeight:'600',
  },
  input:{
    backgroundColor:'white',
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:30,
    marginVertical:20,
    fontSize:18,
  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginBottom:10,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius:15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',

  },
  toDoText:{
    color:'white',
    fontSize:16,
    fontWeight:'500',
  },

});
