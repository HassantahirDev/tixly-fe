import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const CreateEvent: React.FC = () => {
  const router = useRouter();
  const [isPaymentFormVisible, setPaymentFormVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/organizer/home')}>
          <AntDesign name="arrowleft" size={19} color="#F0F0F0" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create event</Text>
        <TouchableOpacity onPress={() => router.push('/organizer/home')}>
          <AntDesign name="close" size={19} color="#F0F0F0" />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <ScrollView>
        <View style={styles.eventContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Event Name</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Tixly Events"
              placeholderTextColor="#F0F0F0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Category</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Select Category"
              placeholderTextColor="#F0F0F0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Date</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Select Date"
              placeholderTextColor="#F0F0F0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Time</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="12:00 AM - 02:00 AM"
              placeholderTextColor="#F0F0F0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Venue</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Johar Town, lahore"
              placeholderTextColor="#F0F0F0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>No of Available Tickets</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="300"
              placeholderTextColor="#F0F0F0"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ticket Price</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="1200 Rs"
              placeholderTextColor="#F0F0F0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Payment Method</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Jazcash"
              placeholderTextColor="#F0F0F0"
            />
          </View>

          <TouchableOpacity onPress={() => setPaymentFormVisible(true)}>
            <Text style={styles.paymentText}>Add Payment Details</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Event Details</Text>
            <TextInput
              style={styles.inputBox1}
              placeholder="Enter Event Details"
              placeholderTextColor="#F0F0F0"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Event Details</Text>
            <TextInput
              style={styles.inputBox1}
              placeholder="Enter Highlists"
              placeholderTextColor="#F0F0F0"
              multiline
              numberOfLines={4}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 22,
            }}
          >
            <View style={{ marginRight: 8 }}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle} />
              </View>
            </View>
            <Text style={styles.commentText}>Allow Comments</Text>
          </View>

          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Create Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isPaymentFormVisible && (
        <View style={styles.paymentFormContainer}>
          <View style={styles.paymentForm}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setPaymentFormVisible(false)}>
                <AntDesign name="arrowleft" size={19} color="#F0F0F0" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Jazzcash Account Details</Text>
              <TouchableOpacity onPress={() => setPaymentFormVisible(false)}>
                <AntDesign name="close" size={19} color="#F0F0F0" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.inputFormArea}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Account Name</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Tixly Events"
                  placeholderTextColor="#F0F0F0"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="+92 304 6780099"
                  placeholderTextColor="#F0F0F0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Suggestion</Text>
                <TextInput
                  style={styles.inputBox1}
                  placeholder="type any suggestions regarding payment here"
                  placeholderTextColor="#F0F0F0"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => setPaymentFormVisible(false)}
              >
                <Text style={styles.buyButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
  separator: {
    width: '95%',
    height: 1,
    backgroundColor: '#949494',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 22,
  },

  eventContainer: {
    paddingHorizontal: '7%',
  },

  inputContainer: {
    marginTop: 20,
  },
  inputFormArea: {
    marginHorizontal: '7%',
  },
  inputLabel: {
    width: 'auto',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.04 * 12,

    color: '#949494',
    marginBottom: 8,
  },
  inputBox: {
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
  inputBox1: {
    width: 'auto',
    height: 66,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#949494',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 0.04 * 14,
    textAlignVertical: 'center',
    color: '#F0F0F0',
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  paymentText: {
    color: '#BA0507',
    marginTop: 18,
    fontFamily: 'Urbanist_600SemiBold',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  outerCircle: {
    width: 16,
    height: 16,
    borderWidth: 0.83,
    borderColor: '#949494',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 10.6,
    height: 10.6,
    borderWidth: 0.83,
    borderColor: '#949494',
    borderRadius: 5.3,
  },
  selectedInnerCircle: {
    backgroundColor: '#949494',
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#F0F0F0',
    letterSpacing: 0.04 * 12,
  },
  buyButton: {
    marginVertical: 21,
    backgroundColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },

  paymentFormContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    justifyContent: 'flex-end',
  },
  paymentForm: {
    backgroundColor: '#1E1E1E',

    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
