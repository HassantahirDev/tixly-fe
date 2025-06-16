import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Header from '@/src/components/Header';
import TicketCard from '@/src/components/TicketCard';
import RoleNavigation from '@/src/components/Navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Barcode from '@/src/components/barcode';
import { useAppDispatch } from '@/src/store/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { fetchUserTicketsPayments } from '@/src/store/slices/eventPaymentSlice';
import { getCurrentUserId } from '@/src/services/api';

const noTicket = require('../../src/assets/images/noTicket.svg');

const OrganizerTickets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userTickets, userTicketsLoading, userTicketsError } = useSelector(
    (state: RootState) => state.eventPayment
  );

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = await getCurrentUserId();
      if (id) {
        setUserId(id);
        dispatch(fetchUserTicketsPayments(id));
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {userTicketsLoading ? (
          <View style={styles.noTicketsContainer}>
            <Text style={styles.noTicketsTitle}>Loading tickets...</Text>
          </View>
        ) : userTicketsError ? (
          <View style={styles.noTicketsContainer}>
            <Text style={styles.noTicketsTitle}>{userTicketsError}</Text>
          </View>
        ) : userTickets.length === 0 ? (
          <View style={styles.noTicketsContainer}>
            <LinearGradient
              colors={['rgba(127, 1, 2, 0.7)', 'rgba(11, 1, 121, 0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.noTicketsGradient}
            >
              <View style={styles.noTicketsContent}>
                <Image
                  source={noTicket}
                  style={styles.noTicketsImage}
                  resizeMode="contain"
                />
                <Text style={styles.noTicketsTitle}>No tickets available.</Text>
              </View>
            </LinearGradient>
            <Text style={styles.noTicketsHint}>
              Explore events and buy tickets to add your previous ones in this
              list. Thanks!
            </Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.buyButtonText}>Explore Events</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.manageText}>
              Here are the Tickets of all events attended by you till now!
            </Text>
            {userTickets.map((ticketItem, index) => (
              <View
                key={ticketItem.id}
                style={{
                  marginBottom: index === userTickets.length - 1 ? 85 : 0,
                }}
              >
                <TicketCard
                  title={ticketItem.Event.title}
                  location={ticketItem.Event.location}
                  time={new Date(ticketItem.Event.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  date={new Date(ticketItem.Event.date).toLocaleDateString(
                    'en-US',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                  )}
                  price={`PKR ${ticketItem.Event.price}`}
                  barcode={<Barcode />}
                />
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <RoleNavigation role={'user'} />
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
    fontSize: 18,
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

  noTicketsContainer: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 46,
  },

  noTicketsGradient: {
    width: '100%',
    height: 239,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noTicketsContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  noTicketsImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  noTicketsTitle: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 16,
    color: '#E1E1E1',
    marginTop: 25,
  },

  noTicketsHint: {
    color: '#E1E1E1',
    fontSize: 18,
    fontFamily: 'Urbanist_400Regular',
    marginTop: 20,
    marginBottom: 25,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
