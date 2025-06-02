import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fetchEventCategories } from '@/src/store/slices/homeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { homeApi } from '@/src/services/api';
import * as ImagePicker from 'expo-image-picker';
import { imageApi, categoryApi } from '@/src/services/api';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';
const dummyConcertImage =
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80';

// Polyfill for alert and document for SSR/TypeScript (final, unique names)
// @ts-ignore
const _webWindow: any = typeof window !== 'undefined' ? window : undefined;
const _webAlert = _webWindow && _webWindow.alert ? _webWindow.alert : (msg: string) => { console.log(msg); };
const _webDoc = _webWindow && _webWindow.document ? _webWindow.document : undefined;

// @ts-ignore
const globalDoc: Document | undefined = typeof document !== 'undefined' ? document : undefined;
// @ts-ignore
const globalAlert: ((msg: string) => void) = typeof alert !== 'undefined' ? alert : (msg: string) => { console.log(msg); };

export default function AdminHomeScreen() {
  const router = useRouter();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editCategory, setEditCategory] = useState({
    id: '', // Add id field for editing category
    name: '',
    image: '', // Only one 'image' property
    desc: '',
  });
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [liveEvent, setLiveEvent] = useState<any>(null);
  const [ongoingEvents, setOngoingEvents] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');


  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.home
  );
  const { featuredEvents, featuredEventsLoading, featuredEventsError } =
    useSelector((state: RootState) => state.home);

  useEffect(() => {
    dispatch(fetchEventCategories());
    // dispatch(fetchFeaturedEvents());
    homeApi.getUpcomingEvents().then((res) => {
      if (res.data && res.data.data) {
        setUpcomingEvents(res.data.data);
      }
    });
    // Fetch ongoing (live) event for admin card
    homeApi.getOngoingEvents().then((res) => {
      if (res.data && res.data.data && res.data.data.length > 0) {
        setLiveEvent(res.data.data[0]);
        setOngoingEvents(res.data.data); // Save all ongoing events for navigation
      } else {
        setLiveEvent(null);
        setOngoingEvents([]);
      }
    });
  }, [dispatch]);

  // Handler for edit modal open
  const handleEditCategory = (cat: any) => {
    setEditCategory({
      id: cat.id, // set id for direct use
      name: cat.name,
      image: cat.attachment, // map attachment to image for edit modal
      desc: cat.desc || '',
    });
    setShowEditCategory(true);
  };

  // Handler for image selection (for both add and edit)
  const handleImagePick = async (setImage: (url: string) => void) => {
    if (Platform.OS === 'web') {
      // For web, trigger a hidden file input
      if (!_webDoc) return;
      const input = _webDoc.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const res = await imageApi.uploadSingleImage(file);
            const url = res.data;
            setImage(url);
          } catch (err) {
            _webAlert('Image upload failed.');
          }
        }
      };
      input.click();
    } else {
      // For mobile, use Expo ImagePicker
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        _webAlert('Permission to access camera roll is required!');
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || 'category.jpg',
          type: asset.type || 'image/jpeg',
        };
        try {
          const res = await imageApi.uploadSingleImage(file);
          const url = res.data;
          setImage(url);
        } catch (err) {
          _webAlert('Image upload failed.');
        }
      }
    }
  };

  // Add Category
  const handleAddCategory = async () => {
    if (!categoryName || !categoryImage) {
      _webAlert('Please provide a name and image.');
      return;
    }
    try {
      await categoryApi.createCategory({
        name: categoryName,
        desc: categoryDesc,
        attachment: categoryImage,
      });
      setShowAddCategory(false);
      setCategoryName('');
      setCategoryImage('');
      setCategoryDesc('');
      dispatch(fetchEventCategories());
    } catch (err) {
      _webAlert('Failed to create category.');
    }
  };

  // Edit Category
  const handleEditCategorySave = async () => {
    if (!editCategory.name || !editCategory.image) {
      _webAlert('Please provide a name and image.');
      return;
    }
    try {
      // Use id directly from editCategory
      await categoryApi.updateCategory(editCategory.id, {
        name: editCategory.name,
        desc: editCategory.desc,
        attachment: editCategory.image,
      });
      setShowEditCategory(false);
      setEditCategory({ id: '', name: '', image: '', desc: '' });
      dispatch(fetchEventCategories());
    } catch (err) {
      _webAlert('Failed to update category.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>TiXLY</Text>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <TouchableOpacity onPress={() => router.push('/admin/notifications')}>
                <Ionicons name="notifications-outline" size={24} color="white" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/admin/profile')}>
              <Image
                source={{ uri: dummyProfilePic }}
                style={styles.profilePic}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {/* Replace your Search Bar code with the following: */}

        <View style={styles.searchContainer}>
  <Ionicons
    name="search"
    size={20}
    color="#666"
    style={styles.searchIcon}
  />
  <TextInput
    style={styles.searchInput}
    placeholder="Discover"
    placeholderTextColor="#fff"
    value={searchText}
    onChangeText={setSearchText}
    underlineColorAndroid="transparent"
    selectionColor="#fff"
    
  />
</View>

        {/* Admin Event Management Card */}
        <View style={styles.eventCard}>
          <Image
            source={{ uri: dummyConcertImage }}
            style={styles.eventImage}
          />
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>Effortless Event Management</Text>
          </View>
          <Text style={styles.eventDesc}>
            Monitor, Approve, and Optimize with Ease!
          </Text>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => router.push('/admin/events')}
          >
            <Text style={styles.manageButtonText}>Manage all Events</Text>
          </TouchableOpacity>
        </View>

        {/* Categories (Admin View) */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 20 }}
          >
            {categories?.data?.map((cat: any) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => handleEditCategory(cat)}
              >
                <View style={styles.categoryContent}>
                  <Image
                    source={{ uri: cat.attachment }}
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryText}>{cat.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.categoryItem,
                {
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
              onPress={() => setShowAddCategory(true)}
            >
              <Ionicons
                name="add"
                size={24}
                color="#222"
                style={{ marginRight: 8, marginLeft: 4 }}
              />
              <Text style={[styles.categoryText, { color: '#222' }]}>
                Add New
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Event (Admin) - Match user featured event card UI exactly */}
        <View style={styles.topEventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTwoTitle}>Live Event</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/admin/events',
                  params: {
                    mode: 'ongoing',
                    heading: 'Ongoing Events',
                    hideApproval: 'true',
                    events: JSON.stringify(ongoingEvents), // Pass events as string
                  },
                })
              }
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.eventCard,
              {
                backgroundColor: '#232323',
                margin: 20,
                borderRadius: 28,
                padding: 0,
                paddingBottom: 0,
              },
            ]}
          >
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: liveEvent?.attachment || dummyConcertImage }}
                style={[
                  styles.eventImage,
                  { borderRadius: 24, margin: 0, width: '100%', height: 180 },
                ]}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  backgroundColor: '#BA0507',
                  borderRadius: 16,
                  width: 54,
                  height: 54,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 18,
                    lineHeight: 20,
                  }}
                >
                  {liveEvent
                    ? String(new Date(liveEvent.date).getDate()).padStart(
                        2,
                        '0'
                      )
                    : '02'}
                </Text>
                <Text style={{ color: 'white', fontSize: 13, lineHeight: 16 }}>
                  {liveEvent
                    ? new Date(liveEvent.date).toLocaleString('default', {
                        month: 'short',
                      })
                    : 'Apr'}
                </Text>
              </View>
              {/* <TouchableOpacity style={{ position: 'absolute', top: 16, right: 16, backgroundColor: '#232323', borderRadius: 16, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <Ionicons name="heart-outline" size={24} color="white" />
              </TouchableOpacity> */}
            </View>
            <View style={{ padding: 20, paddingBottom: 0 }}>
              <View style={[styles.eventHeader, { marginBottom: 8 }]}>
                <Text
                  style={[
                    styles.eventTitle,
                    {
                      color: 'white',
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: 'Urbanist_400Regular',
                    },
                  ]}
                >
                  Tixly concert
                </Text>
                <Text
                  style={[
                    styles.priceText,
                    {
                      color: 'white',
                      fontSize: 22,
                      fontFamily: 'Urbanist_400Regular',
                    },
                  ]}
                >
                  PKR {liveEvent?.price ?? 500}
                </Text>
              </View>
              <View style={[styles.locationContainer, { marginBottom: 10 }]}>
                <Ionicons name="location-outline" size={16} color="#E1E1E1" />
                <Text
                  style={[
                    styles.locationText,
                    { color: '#E1E1E1', marginLeft: 5, fontSize: 14 },
                  ]}
                >
                  {liveEvent?.location ?? 'Bahria Town, Lahore'} |{' '}
                  {liveEvent
                    ? new Date(liveEvent.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '04:00 PM'}
                </Text>
              </View>
              <View
                style={[
                  styles.eventBottom,
                  {
                    marginTop: 0,
                    marginBottom: 10,
                    justifyContent: 'space-between',
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      backgroundColor: '#BA0507',
                      borderRadius: 20,
                      width: 48,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      1.2K
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{ uri: dummyProfilePic }}
                      style={[
                        styles.attendeeImage,
                        {
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginLeft: 0,
                        },
                      ]}
                    />
                    <Image
                      source={{
                        uri: 'https://randomuser.me/api/portraits/women/1.jpg',
                      }}
                      style={[
                        styles.attendeeImage,
                        {
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginLeft: -10,
                        },
                      ]}
                    />
                  </View>
                </View>
                {/* <TouchableOpacity style={[styles.joinButton, { backgroundColor: '#BA0507', height: 40, width: 196, borderRadius: 25, paddingVertical: 8, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }]}> 
                  <Text style={[styles.joinButtonText, { color: 'white', fontSize: 16, fontFamily: 'Urbanist_400Regular', letterSpacing: 2, textAlign: 'center' }]}>Join Now</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View style={{ marginBottom: 100 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTwoTitle}>Upcoming Events</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/admin/events',
                  params: {
                    mode: 'upcoming',
                    heading: 'Upcoming Events',
                    hideApproval: 'true',
                    events: JSON.stringify(upcomingEvents),
                  },
                })
              }
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.length === 0 ? (
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
              No upcoming events
            </Text>
          ) : (
            upcomingEvents.map((event: any) => (
              <TouchableOpacity key={event.id} style={styles.topEventCard}>
                <Image
                  source={{ uri: event.attachment || dummyConcertImage }}
                  style={styles.topEventImage}
                />
                <View style={styles.topEventDetails}>
                  <Text style={styles.topEventTitle}>{event.title}</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#E1E1E1"
                    />
                    <Text style={styles.locationText}>{event.location}</Text>
                  </View>
                  <Text style={styles.timeText}>
                    {new Date(event.startTime).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.topEventPrice}>
                  <Text style={styles.priceText}>PKR {event.price}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add New Category Bottom Sheet */}
      <Modal
        visible={showAddCategory}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddCategory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowAddCategory(false)}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Add new category</Text>
              <TouchableOpacity onPress={() => setShowAddCategory(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetDivider} />
            <Text style={styles.sheetLabel}>Category Name</Text>
            <TextInput
              style={styles.sheetInput}
              placeholder="Tourism"
              placeholderTextColor="#888"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <Text style={styles.sheetLabel}>Image</Text>
            <TouchableOpacity
              style={styles.sheetInput}
              activeOpacity={0.7}
              onPress={() => handleImagePick(setCategoryImage)}
            >
              {categoryImage ? (
                <Image
                  source={{ uri: categoryImage }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                />
              ) : (
                <Text style={{ color: '#888' }}>upload an image</Text>
              )}
              <Ionicons
                name="attach"
                size={20}
                color="#888"
                style={{ position: 'absolute', right: 12, top: 12 }}
              />
            </TouchableOpacity>
            <Text style={styles.sheetLabel}>Description</Text>
            <TextInput
              style={[styles.sheetInput, { height: 60 }]}
              placeholder="Lorem ipsum"
              placeholderTextColor="#888"
              value={categoryDesc}
              onChangeText={setCategoryDesc}
              multiline
            />
            <TouchableOpacity style={styles.sheetButton} onPress={handleAddCategory}>
              <Text style={styles.sheetButtonText}>Add New Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Category Bottom Sheet */}
      <Modal
        visible={showEditCategory}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditCategory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowEditCategory(false)}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Edit category</Text>
              <TouchableOpacity onPress={() => setShowEditCategory(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetDivider} />
            <Text style={styles.sheetLabel}>Category Name</Text>
            <TextInput
              style={styles.sheetInput}
              placeholder="Category Name"
              placeholderTextColor="#888"
              value={editCategory.name}
              onChangeText={(name) =>
                setEditCategory({ ...editCategory, name })
              }
            />
            <Text style={styles.sheetLabel}>Image</Text>
            <TouchableOpacity
              style={styles.sheetInput}
              activeOpacity={0.7}
              onPress={() =>
                handleImagePick((uri) =>
                  setEditCategory({ ...editCategory, image: uri })
                )
              }
            >
              {editCategory.image ? (
                <Image
                  source={{ uri: editCategory.image }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                />
              ) : (
                <Text style={{ color: '#888' }}>upload an image</Text>
              )}
              <Ionicons
                name="attach"
                size={20}
                color="#888"
                style={{ position: 'absolute', right: 12, top: 12 }}
              />
            </TouchableOpacity>
            <Text style={styles.sheetLabel}>Description</Text>
            <TextInput
              style={[styles.sheetInput, { height: 60 }]}
              placeholder="Description"
              placeholderTextColor="#888"
              value={editCategory.desc}
              onChangeText={(desc) =>
                setEditCategory({ ...editCategory, desc })
              }
              multiline
            />
            <TouchableOpacity style={styles.sheetButton} onPress={handleEditCategorySave}>
              <Text style={styles.sheetButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#FF4B55" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/events')}
        >
          <Ionicons name="calendar-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/tickets')}
        >
          <Ionicons name="ticket-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 15,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 56, // Ensure a fixed height for vertical centering
  },
  searchIcon: {
    marginRight: 10,
  },
  // ...inside StyleSheet.create({
searchInput: {
  flex: 1,
  color: 'white',
  fontSize: 18,
  fontFamily: 'Urbanist_600SemiBold',
  textAlignVertical: 'center',
  textAlign: 'left',
  paddingVertical: 0,
  height: 56,
  lineHeight: 56,
  includeFontPadding: false,
  backgroundColor: 'transparent', // ensure no background
  borderWidth: 0, // remove border
},
// ...rest of styles
  categoriesSection: {
    paddingRight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    marginBottom: 15,
    fontFamily: 'Urbanist_600SemiBold',
  },
  sectionTwoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Urbanist_600SemiBold',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    overflow: 'hidden',
    paddingRight: 32, // increased from 20 to 32 for more width
    paddingVertical: 4,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingRight: 0,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  eventCard: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 12,
    paddingBottom: 12,
  },
  eventImage: {
    width: '100%',
    height: 165,
    borderRadius: 15,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_400Regular',
  },
  eventDesc: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Urbanist_400Regular',
  },
  manageButton: {
    backgroundColor: '#BA0507',
    height: 40,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    letterSpacing: 2,
    textAlign: 'center',
  },
  topEventsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  seeAllText: {
    color: '#FF4B55',
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
  },
  topEventCard: {
    padding: 12,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  topEventImage: {
    width: 80,
    borderRadius: 15,
    height: 80,
  },
  topEventDetails: {
    flex: 1,
    padding: 10,
  },
  topEventTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Urbanist_600SemiBold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  timeText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Urbanist_400Regular',
  },
  locationText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginLeft: 5,
    fontFamily: 'Urbanist_400Regular',
  },
  topEventPrice: {
    padding: 10,
    justifyContent: 'center',
  },
  topEventFavorite: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingBottom: 25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Urbanist_400Regular',
  },
  activeNavText: {
    color: '#FF4B55',
  },
  priceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  dateChip: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#BA0507',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  monthText: {
    color: 'white',
    fontSize: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  eventBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -10,
  },
  joinButton: {
    backgroundColor: '#FF4B55',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  attendeesCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  attendeeImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeCountBadge: {
    backgroundColor: '#BA0507',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendeeCountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Urbanist_400Regular',
  },
  sheetDivider: {
    height: 1,
    backgroundColor: '#949494',
    marginVertical: 12,
  },
  sheetLabel: {
    color: '#949494',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
    fontFamily: 'Urbanist_400Regular',
  },
  sheetInput: {
    backgroundColor: '#232323',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'Urbanist_400Regular',
    borderWidth: 1,
    borderColor: '#949494', // updated border color
  },
  sheetButton: {
    backgroundColor: '#BA0507',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  sheetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    letterSpacing: 1,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#232323',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 18,
    padding: 14,
    position: 'relative',
  },
  upcomingImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 14,
  },
  upcomingDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  upcomingTitle: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 6,
  },
  upcomingPrice: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: 80,
  },
  upcomingPriceText: {
    color: '#FF4B55',
    fontSize: 20,
    fontFamily: 'Urbanist_600SemiBold',
  },
  upcomingFavorite: {
    position: 'absolute',
    top: 18,
    right: 18,
  },
});
