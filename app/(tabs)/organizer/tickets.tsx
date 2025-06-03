import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Header from '../../../src/components/Header';
import TicketCard from '../../../src/components/TicketCard';
import Barcode from '../../../src/components/barcode';
import { AntDesign } from '@expo/vector-icons';
import RoleNavigation from '@/src/components/Navigation';

const OrganizerTickets: React.FC = () => {
  const [isUpdateTicket, setupdateTicket] = useState(false);

  // Sample ticket data
  const ticket = [
    {
      id: '1',
      title: 'Tixly concert - The Immersive Experience',
      location: 'Bahria Town, Lahore',
      time: '04:00 PM',
      date: '12 Apr, 2025',
      price: 'PKR 500',
      barcode: <Barcode />,
    },
    {
      id: '2',
      title: 'Tixly concert - The Immersive Experience',
      location: 'Bahria Town, Lahore',
      time: '04:00 PM',
      date: '12 Apr, 2025',
      price: 'PKR 500',
      barcode: <Barcode />,
    },
  ];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView>
        <Text style={styles.manageText}>Manage your Events Tickets</Text>
        {ticket.map((ticket) => (
          <TicketCard
            title="Tixly concert - The Immersive Experience"
            location="Bahria Town, Lahore"
            time="04:00 PM"
            date="12 Apr, 2025"
            price="PKR 500"
            barcode={<Barcode />}
          />
        ))}

        <View style={styles.boxRow}>
          <View style={styles.box}>
            <Text style={styles.BoxText}>No of Reserved Tickets</Text>
            <Text style={styles.BoxNumber}>30</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.BoxText}>No of Available Tickets</Text>
            <Text style={styles.BoxNumber}>270</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => setupdateTicket(true)}
        >
          <Text style={styles.buyButtonText}>Update Ticket</Text>
        </TouchableOpacity>

        <Text style={styles.manageText}>Your reserved tickets</Text>
        {ticket.map((ticket) => (
          <TicketCard
            key={ticket.id}
            title={ticket.title}
            location={ticket.location}
            time={ticket.time}
            date={ticket.date}
            price={ticket.price}
            barcode={ticket.barcode}
          />
        ))}
      </ScrollView>

      {isUpdateTicket && (
        <View style={styles.paymentFormContainer}>
          <ScrollView>
            <View style={styles.paymentForm}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setupdateTicket(false)}>
                  <AntDesign name="arrowleft" size={19} color="#F0F0F0" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Update Ticket</Text>
                <TouchableOpacity onPress={() => setupdateTicket(false)}>
                  <AntDesign name="close" size={19} color="#F0F0F0" />
                </TouchableOpacity>
              </View>

              <View style={styles.separator} />
              <View style={styles.inputFormArea}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Event Name</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="Tixly Events"
                    placeholderTextColor="#F0F0F0"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#F0F0F0"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Time</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="12:00 AM - 03:00 AM"
                    placeholderTextColor="#F0F0F0"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Venue</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="Bahria Town"
                    placeholderTextColor="#F0F0F0"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>No of Available Tickets</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="300"
                    placeholderTextColor="#F0F0F0"
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

                <TouchableOpacity>
                  <Text style={styles.paymentText}>Add Payment Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buyButton1}
                  onPress={() => setupdateTicket(false)}
                >
                  <Text style={styles.buyButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <RoleNavigation role="organizer" />
        </View>
      )}
    </View>
  );
};

export default OrganizerTickets;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  manageText: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 15,
    color: '#E1E1E1',
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 20,
    gap: 20,
  },

  box: {
    flex: 1,
    minHeight: 136,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    padding: 12,
  },
  BoxText: {
    fontFamily: 'Urbanist_600SemiBold',
    color: '#E1E1E1',
    fontSize: 18,
    letterSpacing: 1,
    lineHeight: 24,
  },
  BoxNumber: {
    color: '#F5F5F5',
    letterSpacing: 1,
    lineHeight: 24,
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 45,
    paddingTop: 20,
  },
  buyButton: {
    backgroundColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 18,
  },
  buyButton1: {
    backgroundColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginBottom: 18,
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
  paymentText: {
    color: '#BA0507',
    marginVertical: 18,
    fontFamily: 'Urbanist_600SemiBold',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
});
