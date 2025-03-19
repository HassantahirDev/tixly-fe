import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Foundation from '@expo/vector-icons/Foundation';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
// import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
const thankYouImage = require('../../src/assets/images/thankYou.png');

interface PaymentProps {
  onClose: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onClose }) => {
  const { id } = useLocalSearchParams();
  const { featuredEvents } = useSelector((state: RootState) => state.home);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showAccountDetailsForm, setShowAccountDetailsForm] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  // const [easyPaisaAccountNumber, setEasyPaisaAccountNumber] = useState('');
  // const [jazzCashAccountNumber, setJazzCashAccountNumber] = useState('');
  // const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'success' | 'failed' | null>(
    null
  );
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image before uploading.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // setUploadStatus('success');
      setUploadStatus('failed');
      if (uploadStatus === 'success') {
        setShowVerification(false);
      }
      Alert.alert('Success', 'Image uploaded successfully.');
    } catch (error) {
      setUploadStatus('failed');
      Alert.alert('Upload Failed', 'Please try again.');
    }
  };

  const paymentOptions = [
    'Jazzcash',
    'EasyPaisa',
    'Bank Transfer',
    'Credit Card',
  ];
  const event = featuredEvents?.find((event) => event.id === id);

  return (
    <Formik
      initialValues={{
        ticketCount: 2,
        selectedMethod: '',
        accountName: 'Tixly Events',
        easyPaisaAccountNumber: '+92 340 6780099',
        jazzCashAccountNumber: '+92 304 6780099',
        bankAccountNumber: '239482439487878',
        bankName: 'Meezan Bank Limited',
      }}
      // validationSchema={PaymentSchema}
      onSubmit={(values) => {
        console.log('Form Data:', values);
        setShowAccountDetailsForm(false);
        setShowVerification(true);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
        validateForm,
        setTouched,
      }) => {
        return (
          <View style={styles.overlay}>
            <View style={styles.container}>
              <View style={styles.header}>
                {(uploadStatus === 'failed' ||
                  showVerification ||
                  showPaymentMethod ||
                  showAccountDetailsForm) && (
                  <TouchableOpacity
                    onPress={() => {
                      if (showVerification) {
                        setShowVerification(false);
                        setShowAccountDetailsForm(true);
                      } else if (showAccountDetailsForm) {
                        setShowAccountDetailsForm(false);
                        setShowPaymentMethod(true);
                      } else {
                        setShowPaymentMethod(false);
                      }
                    }}
                  >
                    <AntDesign name="arrowleft" size={24} color="#F0F0F0" />
                  </TouchableOpacity>
                )}
                <Text style={styles.text}>
                  {uploadStatus === 'success'
                    ? 'Successfully Done'
                    : uploadStatus === 'failed'
                    ? 'Try Again'
                    : showVerification
                    ? 'Verification'
                    : showAccountDetailsForm
                    ? values.selectedMethod === 'Bank Transfer'
                      ? 'Bank Account Details'
                      : values.selectedMethod === 'Credit Card'
                      ? 'Credit Card Details'
                      : `${values.selectedMethod} Account Details`
                    : showPaymentMethod
                    ? 'Select your Payment Method'
                    : 'Select No of Tickets'}
                </Text>

                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <AntDesign name="close" size={24} color="#F0F0F0" />
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />

              {uploadStatus !== 'success' &&
                !showVerification &&
                !showPaymentMethod &&
                !showAccountDetailsForm && (
                  <>
                    <View style={styles.header}>
                      {/* Counter Section */}
                      <View style={styles.counterContainer}>
                        <TouchableOpacity
                          style={styles.circleButton}
                          onPress={() =>
                            setFieldValue(
                              'ticketCount',
                              Math.max(1, values.ticketCount - 1)
                            )
                          }
                        >
                          <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.countText}>
                          {String(values.ticketCount).padStart(2, '0')}
                        </Text>
                        <TouchableOpacity
                          style={styles.circleButton}
                          onPress={() =>
                            setFieldValue('ticketCount', values.ticketCount + 1)
                          }
                        >
                          <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      {/* View Tickets Text */}
                      <TouchableOpacity>
                        <Text style={styles.viewTickets}>View Tickets</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => setShowPaymentMethod(true)}
                    >
                      <Text style={styles.buyButtonText}>
                        Buy it - PKR {event?.price}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

              {showPaymentMethod && (
                <View>
                  {paymentOptions.map((method, index) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentContainer,
                        index === paymentOptions.length - 1 && {
                          marginBottom: 0,
                        },
                      ]}
                      onPress={() => {
                        setFieldValue('selectedMethod', method);
                        setShowPaymentMethod(false);
                        setShowAccountDetailsForm(true);
                      }}
                    >
                      <View style={styles.outerCircle}>
                        <View
                          style={[
                            styles.innerCircle,
                            values.selectedMethod === method &&
                              styles.selectedInnerCircle,
                          ]}
                        />
                      </View>
                      <Text style={styles.paymentText}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Payment Details Form */}
              {showAccountDetailsForm && (
                <View>
                  <Text>
                    {values.selectedMethod === 'Jazzcash' ||
                    values.selectedMethod === 'EasyPaisa' ? (
                      <View>
                        <View style={styles.formContainer}>
                          <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Account Name</Text>
                            <TextInput
                              style={styles.inputBox}
                              placeholder="Enter Account Name"
                              placeholderTextColor="#949494"
                              // onChangeText={handleChange('accountName')}
                              // onBlur={handleBlur('accountName')}
                              value={values.accountName}
                            />
                            {/* {touched.accountName && errors.accountName && (
                              <Text style={styles.errorText}>
                                {errors.accountName}
                              </Text>
                            )} */}
                          </View>
                          <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                              Account Number
                            </Text>
                            <TextInput
                              style={styles.inputBox}
                              placeholder="Enter Account Number"
                              placeholderTextColor="#949494"
                              // keyboardType="numeric"
                              // maxLength={11}
                              // onChangeText={(text) => {
                              //   const sanitizedText = text
                              //     .replace(/[^0-9]/g, '')
                              //     .slice(0, 11);
                              //   handleChange('accountNumber')(sanitizedText);
                              // }}
                              // onBlur={handleBlur('accountNumber')}
                              value={
                                values.selectedMethod === 'EasyPaisa'
                                  ? values.easyPaisaAccountNumber
                                  : values.jazzCashAccountNumber
                              }
                            />
                            {/* {touched.accountNumber && errors.accountNumber && (
                              <Text style={styles.errorText}>
                                {errors.accountNumber}
                              </Text>
                            )} */}
                          </View>
                          <view>
                            <Text style={styles.paymentInstructions}>
                              Pay through {values.selectedMethod} in the given
                              account number & upload screenshot for
                              verification.
                            </Text>
                          </view>
                        </View>
                        <TouchableOpacity
                          style={styles.buyButton}
                          onPress={async () => {
                            setShowAccountDetailsForm(false);
                            setShowVerification(true);
                            // const errors = await validateForm();

                            // if (Object.keys(errors).length === 0) {
                            //   setShowAccountDetailsForm(false);
                            //   setShowVerification(true);
                            // } else {
                            //   setTouched({
                            //     accountName: true,
                            //     accountNumber: true,
                            //   });
                            // }
                          }}
                        >
                          <Text style={styles.buyButtonText}>Verify</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.formContainer}>
                        {/* Bank name */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Bank Name</Text>
                          <TextInput
                            style={styles.inputBox}
                            placeholder="Enter Bank Name"
                            placeholderTextColor="#949494"
                            value={values.bankName}
                          />
                        </View>

                        {/* Second Input */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Account Name</Text>
                          <TextInput
                            style={styles.inputBox}
                            placeholder="Enter Account Name"
                            placeholderTextColor="#949494"
                            value={values.accountName}
                          />
                        </View>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Account Number</Text>
                          <TextInput
                            style={styles.inputBox}
                            placeholder="Enter Account Number"
                            placeholderTextColor="#949494"
                            keyboardType="numeric"
                            // maxLength={15}
                            // onChangeText={(text) => {
                            //   const sanitizedText = text
                            //     .replace(/[^0-9]/g, '')
                            //     .slice(0, 15);
                            //   setBankAccountNumber(sanitizedText);
                            // }}
                            value={values.bankAccountNumber}
                          />
                        </View>
                        <view>
                          <Text style={styles.paymentInstructions}>
                            lorem Ipsum, lorem Ipsum, lorem Ipsum, lorem Ipsum,
                            lorem Ipsum, lorem Ipsum
                          </Text>
                        </view>
                        <TouchableOpacity
                          style={styles.buyButton}
                          onPress={async () => {
                            setShowAccountDetailsForm(false);
                            setShowVerification(true);}}
                        >
                          <Text style={styles.buyButtonText}>Verify</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </Text>
                </View>
              )}

              {/* Verification Form */}
              {showVerification && (
                <View>
                  <View style={styles.formContainer}>
                    <View>
                      {uploadStatus === 'failed' && (
                        <Text style={styles.errortext}>
                          An error occurred, the verification is still pending,
                          try again or try another method for payment. Thanks!
                        </Text>
                      )}
                      <Text style={styles.inputLabel}>Upload Image</Text>

                      <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={pickImage}
                      >
                        <Text style={styles.uploadText}>
                          {imageUri
                            ? 'Image Selected'
                            : 'Select screenshot to upload'}
                        </Text>
                        <Foundation
                          name="paperclip"
                          size={20}
                          color="#F0F0F0"
                        />
                      </TouchableOpacity>

                      {/* {imageUri && (
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.previewImage}
                        />
                      )} */}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={handleUpload}
                  >
                    <Text style={styles.buyButtonText}>
                      {uploadStatus === 'success' ? 'Uploaded' : 'Upload'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {uploadStatus === 'success' && (
                <View style={styles.centerContainer}>
                  <Image source={thankYouImage} style={styles.successImage} />
                </View>
              )}
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'auto',
    backgroundColor: '#1E1E1E',
    paddingBottom: 21,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 31,
  },
  separator: {
    width: '90%',
    height: 1,
    backgroundColor: '#949494',
    alignSelf: 'center',
    marginBottom: 21,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  circleButton: {
    width: 31,
    height: 31,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#BA0507',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#BA0507',
    paddingBottom: 3,
  },
  countText: {
    fontSize: 20,
    color: '#F0F0F0',
    marginHorizontal: 25,
    paddingTop: 4,
    width: 30,
    fontVariant: ['tabular-nums'],
  },
  text: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#F0F0F0',
    lineHeight: 18 * 1.2,
    paddingVertical: 21,
    letterSpacing: 1,
  },
  closeButton: {
    padding: 10,
  },
  viewTickets: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 16,
    lineHeight: 16 * 1.2,
    letterSpacing: 1,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    color: '#BA0507',
  },
  buyButton: {
    marginTop: 21,
    backgroundColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 18,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 31,
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
  paymentText: {
    marginLeft: 10,
    color: '#F0F0F0',
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 21,
  },
  inputContainer: {
    marginBottom: 21,
  },
  inputLabel: {
    width: 'auto',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.04 * 12,
    textAlignVertical: 'center',
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
  paymentInstructions: {
    fontFamily: 'Urbanist_400Regular',
    color: '#949494',
    lineHeight: 14,
    letterSpacing: 0.04 * 14,
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  uploadBox: {
    width: '100%',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadText: {
    color: '#F0F0F0',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  successImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  errortext: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 12,
    color: '#949494',
    marginBottom: 20
  },
});

export default Payment;
