import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addCity, removeCity } from '../reducers/user';

export default function PlacesScreen() {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [addCityName, setAddCityName] = useState('')
  const handlePress = () => {
  fetch(`https://api-adresse.data.gouv.fr/search/?q=${addCityName}`)
    .then((res) => res.json())
    .then((data) => {
      if(data){
        let newCity = {
      name:  data.features[0].properties.city,
      longitude: data.features[0].geometry.coordinates[0],
      latitude: data.features[0].geometry.coordinates[1]
        }
      dispatch(addCity(newCity))}
  })
  setAddCityName('')
};

  const places = user.city.map((data, id) => {
    return (
      <View key={id} style={styles.placeCard}>
        <View>
          <Text style={styles.name}>{data.name}</Text>
          <Text>
            LAT : {data.latitude} LON : {data.longitude}
          </Text>
        </View>
        <FontAwesome name="trash-o" style={styles.icon} onPress={() => dispatch(removeCity(data))}/>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user.nickname}'s Places</Text>

      <View style={styles.inputBlock}>
        <TextInput placeholder="New city" style={styles.input} onChangeText={(value) => setAddCityName(value)} value = {addCityName}/>
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => handlePress()}>
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {places}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
    fontFamily: 'Pacifico_400Regular',
  },
  name: {
    fontSize: 18,
  },
  inputBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: '80%',
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
  },
  input: {
    width: '65%',
    borderBottomWidth: 1,
    borderBottomColor: '#B733D0',
    fontSize: 17,
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#B733D0',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  textButton: {
    color: '#fff',
  },
  scrollView: {
    alignItems: 'center',
    marginTop: 20,
    maxWidth: '100%',
  },
  placeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  icon: {
    color: '#B733D0',
    fontSize: 23,
  },
});
