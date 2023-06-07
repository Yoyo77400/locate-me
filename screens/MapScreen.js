import { StyleSheet, Modal, TextInput, TouchableOpacity, Text, View } from 'react-native';
import React, { useState } from 'react';
import MapView from 'react-native-maps';
import { useEffect } from 'react';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import { addCity } from '../reducers/user';
import { createEntityAdapter } from '@reduxjs/toolkit';

export default function MapScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [modalVisible, setModalVisible] = useState(false);
  const placeMarker = user.city.map((data, i) => {
    return <Marker coordinate={{ latitude: data.latitude, longitude: data.longitude }} title={data.name} />
  });
  const [myPosition, setMyposition] = useState({ latitude: 0, longitude: 0 })
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            let longitude = location.coords.longitude;
            let latitude = location.coords.latitude;
            setMyposition({ latitude: latitude, longitude: longitude })
            console.log(myPosition)
          });
      }
    })();
  }, []);
  const [placeName, setPlaceName] = useState('');
  const [tempCoordinate, setTemCoordinate] = useState({});


  const handleLongPress = (props) => {
    setTemCoordinate({latitude: props.coordinate.latitude, longitude: props.coordinate.longitude })
    setModalVisible(true);
  }
  const handleAddPlace = () => {
    let newPlace = {
      name: placeName,
      latitude: tempCoordinate.latitude,
      longitude: tempCoordinate.longitude
    };
    dispatch(addCity(newPlace));
    setPlaceName('');
    setModalVisible(!modalVisible);
  }


  return (
    <View style={{flex: 1}}>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
          <View style={styles.centeredView}>
          <View style={styles.modalContent}>
            <TextInput placeholder='Nom du lieu' onChangeText={(value) => setPlaceName(value)} value={placeName} style={styles.modalInput} />
            <TouchableOpacity onPress={() => handleAddPlace()} style={styles.modalButton}>
              <Text style={styles.modalText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.modalButton}>
              <Text style={styles.modalText}>Close</Text>
            </TouchableOpacity>
          </View>
          </View>
        </Modal>
    
    <MapView
      mapType="hybrid"
      initialRegion={{
        latitude: 48.889086,
        longitude: 2.6907795,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }}
      style={{ flex: 1 }}
      onLongPress={(e) => handleLongPress(e.nativeEvent)}>
      <Marker coordinate={myPosition} title="my Position" pinColor='#fecb2d' />
      {placeMarker}
    </MapView>
    </View>

  )
}

const styles = StyleSheet.create({
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 50,
    backgroundColor: '#B733D0',
    marginVertical: 5,
    borderRadius: 10
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 500
  },
  modalInput: {
    borderBottomColor: '#B733D0',
    marginBottom: 5,
    borderBottomWidth: 1,
    fontSize: 16,
  }
})