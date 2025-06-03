import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../src/components/Button';
import { colors, typography } from '../src/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    titlePart1: 'Welcome to ',
    titlePart2: 'Tixly',
    description: 'Your Ultimate Event & Ticketing Companion!',
    image: 'https://res.cloudinary.com/drascgtap/image/upload/v1741686750/BookingEngine/pt9udypnxs1hkoi4oiqx.png',
  },
  {
    id: '2',
    title: 'Find the Best Events Around You - Concerts, Gatherings, Festivals & More!',
    
    image: 'https://res.cloudinary.com/drascgtap/image/upload/v1741686677/BookingEngine/wrnv8fxn6wzzhfxgoh1k.png',
  },
];

type OnboardingItem = typeof onboardingData[0];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: width * newIndex,
        animated: true
      });
      setCurrentIndex(newIndex); // Update state immediately for UI changes
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          {item.id === '1' ? (
            <View style={styles.titleContainer}>
              <Text style={styles.titleRegular}>{item.titlePart1}</Text>
              <Text style={styles.titleBold}>{item.titlePart2}</Text>
            </View>
          ) : (
            <Text style={styles.secondOnboardingTitle}>{item.title}</Text>
          )}
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Conditionally render "Explore More" button */}
      {currentIndex === onboardingData.length - 1 && (
        <View style={styles.exploreButtonWrapper}>
          <Button 
            title="Explore More" 
            onPress={() => router.replace('/(auth)/role-selection')}
            style={styles.exploreButton}
          />
        </View>
      )}

      {/* Show arrow button only on the first screen */}
      {currentIndex === 0 && (
        <TouchableOpacity style={styles.arrowButton} onPress={handleNext}>
          <Image source={require('../src/assets/images/Vector.png')} style={{ width: '100%', height: '100%' }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width,
    height: '100%',
  },
  image: {
    width: '100%',
    height: height,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: height,
  },
  content: {
    position: 'absolute',
    top: 618, 
    left: 40,
    right: 40,
  },
  textContainer: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  titleRegular: {
    fontSize: 24,
    color: colors.white,
    fontFamily: 'Urbanist_400Regular',
  },
  titleBold: {
    fontSize: 24,
    color: colors.white,
    fontFamily: 'Urbanist_700Bold',
  },
  secondOnboardingTitle: {
    fontSize: 24,
    width: 318,
    height: 87,
    top: -58,
   
    right: 12,
    color: colors.white,
    fontFamily: 'Urbanist_400Regular',
    letterSpacing: 4
   
  },
  title: {
    fontSize: 24,
    color: colors.white,
    fontFamily: 'Urbanist_700Bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 24,
    color: colors.white,
    fontFamily: 'Urbanist_400Regular',
    opacity: 0.9,
    marginBottom: 32,
  },
  arrowButton: {
    position: 'absolute',
    left: 312,
    right: 40,
    top: 765,
    width: 23,
    height: 27,
  },
  exploreButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 711,
    alignItems: 'center',
  },
  exploreButton: {
    width: 210,
    height: 51,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
    marginVertical: 0,
  },
});