import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Header from '@/src/components/Header';
const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function ProfileSettingScreen() {
  const [profileImage, setProfileImage] = useState(dummyProfilePic);
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
       <Header/>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: dummyProfilePic }}
            style={styles.profilePicture}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
            <Ionicons name="camera" size={24} color="#BA0507" />
          </TouchableOpacity>
        </View>
        <View style={styles.input}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter Account Number"
              placeholderTextColor="#949494"
              value="userffe4382"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full name</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter Account Number"
              placeholderTextColor="#949494"
              value="John Doe"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email / Contact No</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter Account Number"
              placeholderTextColor="#949494"
              value="+92 308 5438903"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.buyButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {isModalVisible && (
        <View style={styles.ticketOverlay}>
          <View style={styles.ticketOverlayContent}>
            <View style={styles.ticketHeader}>
              <TouchableOpacity>
                <AntDesign name="arrowleft" size={24} color="#F0F0F0" />
              </TouchableOpacity>
              <Text style={styles.ticketTitle}>Edit Personal Info</Text>
              <TouchableOpacity
                style={styles.ticketCloseButton}
                onPress={() => setIsModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="#F0F0F0" />
              </TouchableOpacity>
            </View>
            <View style={styles.ticketSeparator} />
          </View>
          <View style={styles.inputProfileContainer}>
            <Text style={styles.inputProfileLabel}>Username</Text>
            <TextInput
              style={styles.inputProfileBox}
              placeholderTextColor="#949494"
              value="userffe4382"
            />
          </View>
          <View style={styles.inputProfileContainer}>
            <Text style={styles.inputProfileLabel}>Full Name</Text>
            <TextInput
              style={styles.inputProfileBox}
              placeholderTextColor="#949494"
              value="John Doe"
            />
          </View>
          <View style={styles.inputProfileContainer}>
            <Text style={styles.inputProfileLabel}>Phone / Email</Text>
            <TextInput
              style={styles.inputProfileBox}
              placeholderTextColor="#949494"
              value="+92 305 2345678"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Urbanist_700Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF4B55',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  profileContainer: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 60,
  },
  profilePicture: {
    width: 156,
    height: 156,
    borderRadius: 100,
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 3,
    marginLeft: 90,
    alignSelf: 'center',
    backgroundColor: '#F0F0F0',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    marginTop: 25,
    marginHorizontal: 18,
  },

  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    width: 'auto',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0.04 * 12,
    textAlignVertical: 'center',
    color: '#E1E1E1',
    marginBottom: 8,
  },
  inputBox: {
    width: 'auto',
    height: 60,
    borderRadius: 4,
    backgroundColor: '#1E1E1E',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0.04 * 14,
    textAlignVertical: 'center',
    color: '#E1E1E1',
    paddingHorizontal: 10,
  },
  buyButton: {
    marginTop: 25,
    height: 51,
    backgroundColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 18,
  },
  buyButtonText: {
    paddingTop: 4,
    color: '#F0F0F0',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },

  ticketOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
  },
  ticketOverlayContent: {
    width: '100%',
    alignItems: 'center',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingVertical: 15,
  },
  ticketTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#F0F0F0',
    letterSpacing: 1,
  },
  ticketCloseButton: {
    padding: 10,
  },
  ticketSeparator: {
    width: '95%',
    height: 1,
    backgroundColor: '#949494',
    alignSelf: 'center',
    marginBottom: 21,
  },

  inputProfileContainer: {
    marginBottom: 21,
    marginHorizontal: 20,
  },
  inputProfileLabel: {
    width: 'auto',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.04 * 12,
    textAlignVertical: 'center',
    color: '#949494',
    marginBottom: 8,
  },
  inputProfileBox: {
    width: 'auto',
    height: 33,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#949494',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0.04 * 14,
    textAlignVertical: 'center',
    color: '#F0F0F0',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  cancelButton: {
    width: '48%',
    height: 51,
    borderWidth: 1,
    borderColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    paddingTop: 4,
    color: '#BA0507',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
  updateButton: {
    width: '48%',
    height: 51,
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#BA0507',
  },
  updateButtonText: {
    paddingTop: 4,
    color: '#F0F0F0',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
});
