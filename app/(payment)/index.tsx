import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Foundation from '@expo/vector-icons/Foundation';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../src/store/hooks';
import { RootState } from '@/src/store/store';
import { useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { fetchBankDetailsByOrganizerId } from '@/src/store/slices/homeSlice';
import {
  uploadSingleImage,
  createTicketsPayment,
} from '@/src/store/slices/eventPaymentSlice';
const thankYouImage = require('../../src/assets/images/thankYou.png');

interface PaymentProps {
  onClose: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams();
  const { selectedEvent, bankDetails, bankDetailsLoading, bankDetailsError } =
    useSelector((state: RootState) => state.home);
  const {
    uploadedImageUrl,
    uploadImageLoading,
    uploadImageError,
    createPaymentLoading,
    createPaymentSuccess,
    createPaymentError,
  } = useSelector((state: RootState) => state.eventPayment);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showAccountDetailsForm, setShowAccountDetailsForm] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    'uploading' | 'success' | 'failed' | null
  >(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow access to your photo library.'
        );
      }
    })();

    if (selectedEvent?.organizerId) {
      dispatch(
        fetchBankDetailsByOrganizerId({ id: selectedEvent.organizerId })
      );
    }
  }, [dispatch, selectedEvent?.organizerId]);

  useEffect(() => {
    if (showVerification) {
      setUploadStatus(null);
    }
  }, [showVerification]);

  useEffect(() => {
    if (createPaymentSuccess) {
      console.log(
        'createPaymentSuccess triggered, setting uploadStatus to success'
      );
      setUploadStatus('success');
      setShowVerification(false);
    }
  }, [createPaymentSuccess]);

  const getInitialValues = () => {
    let easyPaisaAccountNumber = '';
    let jazzCashAccountNumber = '';
    let bankName = '';
    let bankAccountNumber = '';
    let accountHolder = 'John Doe';

    if (bankDetails?.data) {
      const easyPaisa = bankDetails.data.find(
        (detail) => detail.bankName === 'Easypaisa'
      );
      const jazzCash = bankDetails.data.find(
        (detail) => detail.bankName === 'Jazzcash'
      );
      const otherBank = bankDetails.data.find(
        (detail) =>
          detail.bankName !== 'Easypaisa' && detail.bankName !== 'Jazzcash'
      );

      easyPaisaAccountNumber = easyPaisa?.accountNumber || '';
      jazzCashAccountNumber = jazzCash?.accountNumber || '';
      bankName = otherBank?.bankName || '';
      bankAccountNumber = otherBank?.accountNumber || '';
      accountHolder =
        easyPaisa?.accountHolder ||
        jazzCash?.accountHolder ||
        otherBank?.accountHolder ||
        'John Doe';
    }

    return {
      ticketCount: 2,
      selectedMethod: '',
      accountHolder,
      easyPaisaAccountNumber,
      jazzCashAccountNumber,
      bankAccountNumber,
      bankName,
    };
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: Platform.OS === 'web',
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      console.log('Picked image:', {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
        fileName: asset.fileName,
      });
      setImageUri(asset.uri);
    }
  };

  const dataUrlToBlob = async (dataUrl: string) => {
    const response = await fetch(dataUrl);
    return await response.blob();
  };

  const handleUpload = async (values: { ticketCount: number }) => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image before uploading.');
      return;
    }

    if (!selectedEvent?.id) {
      Alert.alert('Error', 'Event ID is missing.');
      return;
    }

    try {
      setUploadStatus('uploading');
      console.log('Starting image upload...');

      const formData = new FormData();

      if (Platform.OS === 'web') {
        const blob = await dataUrlToBlob(imageUri);
        (formData as any).append('image', blob, 'image.jpg');
      } else {
        const fileName = imageUri.split('/').pop() || 'image.jpg';
        const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
        formData.append('image', {
          uri: imageUri,
          name: fileName,
          type: fileType,
        } as any);
      }

      console.log('FormData prepared:', { uri: imageUri });

      const uploadResult = await dispatch(uploadSingleImage(formData)).unwrap();
      console.log('Image upload result:', uploadResult);

      if (!uploadResult) {
        throw new Error('Image upload failed: No URL returned');
      }

      console.log('Creating ticket payment...');
      const paymentResult = await dispatch(
        createTicketsPayment({
          screenshotUrl: uploadResult,
          quantity: values.ticketCount,
          eventId: selectedEvent.id,
        })
      ).unwrap();
      console.log('Ticket payment result:', paymentResult);

      console.log('Upload and payment completed successfully');
    } catch (error) {
      setUploadStatus('failed');
      const errorMessage =
        typeof error === 'string'
          ? error
          : uploadImageError || createPaymentError || 'Please try again.';
      console.error('Upload error:', error, 'Message:', errorMessage);
      Alert.alert('Upload Failed', errorMessage);
    }
  };

  const paymentOptions = [
    'Easypaisa',
    'Jazzcash',
    'Bank Transfer',
    'Credit Card',
  ];

  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={(values) => {
        console.log('Form Data:', values);
        setShowAccountDetailsForm(false);
        setShowVerification(true);
      }}
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              {(uploadStatus === 'failed' ||
                showVerification ||
                showPaymentMethod ||
                showAccountDetailsForm) && (
                <TouchableOpacity
                  onPress={() => {
                    setUploadStatus(null);
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

            {bankDetailsLoading && (
              <View style={styles.centerContainer}>
                <Text style={styles.text}>Loading bank details...</Text>
              </View>
            )}

            {bankDetailsError && (
              <View style={styles.centerContainer}>
                <Text style={styles.errortext}>{bankDetailsError}</Text>
              </View>
            )}

            {!bankDetailsLoading &&
              !bankDetailsError &&
              uploadStatus !== 'success' &&
              !showVerification &&
              !showPaymentMethod &&
              !showAccountDetailsForm && (
                <>
                  <View style={styles.header}>
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
                    <TouchableOpacity>
                      <Text style={styles.viewTickets}>View Tickets</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => setShowPaymentMethod(true)}
                  >
                    <Text style={styles.buyButtonText}>
                      Buy it - PKR {selectedEvent?.price}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

            {showPaymentMethod && (
              <View>
                {paymentOptions.length === 0 && (
                  <Text style={styles.errortext}>
                    No payment methods available for this organizer.
                  </Text>
                )}
                {paymentOptions.map((method, index) => {
                  const isSupported =
                    method === 'Credit Card' ||
                    (method === 'Easypaisa' &&
                      bankDetails?.data?.some(
                        (detail) => detail.bankName === 'Easypaisa'
                      )) ||
                    (method === 'Jazzcash' &&
                      bankDetails?.data?.some(
                        (detail) => detail.bankName === 'Jazzcash'
                      )) ||
                    (method === 'Bank Transfer' &&
                      bankDetails?.data?.some(
                        (detail) =>
                          detail.bankName !== 'Easypaisa' &&
                          detail.bankName !== 'Jazzcash'
                      ));

                  return (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentContainer,
                        index === paymentOptions.length - 1 && {
                          marginBottom: 0,
                        },
                        !isSupported && styles.disabled,
                      ]}
                      onPress={() => {
                        if (!isSupported) {
                          Alert.alert(
                            'Unsupported',
                            `${method} payments are not available for this organizer.`
                          );
                          return;
                        }
                        setFieldValue('selectedMethod', method);
                        setShowPaymentMethod(false);
                        setShowAccountDetailsForm(true);
                      }}
                      disabled={!isSupported}
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
                      <Text
                        style={[
                          styles.paymentText,
                          !isSupported && styles.disabledText,
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {showAccountDetailsForm && (
              <View>
                {values.selectedMethod === 'Jazzcash' ||
                values.selectedMethod === 'Easypaisa' ? (
                  <>
                    <View style={styles.formContainer}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Account Holder</Text>
                        <TextInput
                          style={styles.inputBox}
                          placeholder="Enter Account Holder"
                          placeholderTextColor="#949494"
                          value={values.accountHolder}
                          editable={false}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Account Number</Text>
                        <TextInput
                          style={styles.inputBox}
                          placeholder="Enter Account Number"
                          placeholderTextColor="#949494"
                          value={
                            values.selectedMethod === 'Easypaisa'
                              ? values.easyPaisaAccountNumber
                              : values.jazzCashAccountNumber
                          }
                          editable={false}
                        />
                      </View>
                      <View>
                        <Text style={styles.paymentInstructions}>
                          Pay through {values.selectedMethod} to the given
                          account number & upload a screenshot for verification.
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => {
                        setShowAccountDetailsForm(false);
                        setShowVerification(true);
                      }}
                    >
                      <Text style={styles.buyButtonText}>Verify</Text>
                    </TouchableOpacity>
                  </>
                ) : values.selectedMethod === 'Bank Transfer' ? (
                  <>
                    <View style={styles.formContainer}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Bank Name</Text>
                        <TextInput
                          style={styles.inputBox}
                          placeholder="Enter Bank Name"
                          placeholderTextColor="#949494"
                          value={values.bankName}
                          editable={false}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Account Holder</Text>
                        <TextInput
                          style={styles.inputBox}
                          placeholder="Enter Account Holder"
                          placeholderTextColor="#949494"
                          value={values.accountHolder}
                          editable={false}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Account Number</Text>
                        <TextInput
                          style={styles.inputBox}
                          placeholder="Enter Account Number"
                          placeholderTextColor="#949494"
                          keyboardType="numeric"
                          value={values.bankAccountNumber}
                          editable={false}
                        />
                      </View>
                      <View>
                        <Text style={styles.paymentInstructions}>
                          Transfer the amount to the provided bank account and
                          upload a screenshot for verification.
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => {
                        setShowAccountDetailsForm(false);
                        setShowVerification(true);
                      }}
                    >
                      <Text style={styles.buyButtonText}>Verify</Text>
                    </TouchableOpacity>
                  </>
                ) : values.selectedMethod === 'Credit Card' ? (
                  <View style={styles.formContainer}>
                    <Text style={styles.errortext}>
                      Credit Card payments are not supported for this organizer.
                      Please select another payment method.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.centerContainer}>
                    <Text style={styles.errortext}>
                      This payment method is not supported for this organizer.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {showVerification && (
              <View>
                <View style={styles.formContainer}>
                  <View>
                    {(uploadImageError || createPaymentError) && (
                      <Text style={styles.errortext}>
                        {uploadImageError || createPaymentError}
                      </Text>
                    )}
                    <Text style={styles.inputLabel}>Upload Image</Text>
                    <TouchableOpacity
                      style={styles.uploadBox}
                      onPress={pickImage}
                      disabled={uploadImageLoading || createPaymentLoading}
                    >
                      <Text style={styles.uploadText}>
                        {imageUri
                          ? 'Image Selected'
                          : 'Select screenshot to upload'}
                      </Text>
                      <Foundation name="paperclip" size={20} color="#F0F0F0" />
                    </TouchableOpacity>
                    {imageUri && (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.previewImage}
                      />
                    )}
                    {(uploadImageLoading || createPaymentLoading) && (
                      <Text style={styles.text}>Processing...</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.buyButton,
                    (uploadImageLoading || createPaymentLoading) &&
                      styles.disabled,
                  ]}
                  onPress={() => handleUpload(values)}
                  disabled={uploadImageLoading || createPaymentLoading}
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
      )}
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
    marginBottom: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#949494',
  },
});

export default Payment;
